require("dotenv").config();
const express = require("express");
const session = require("express-session");
const RedisStore = require("connect-redis")(session);
const redis = require("redis");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const app = express();
const path = require("path");
require("./config/db")(mongoose);
const empController = require("./router");
const compression = require("compression");
const helmet = require("helmet");
const os = require("os");
app.use(express.json());
app.use(cookieParser());

app.use(compression()); //Compress all routes
app.use(helmet());
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.use(morgan("dev"));
const allowlist = ["http://localhost:3000", "http://localhost:4000"];
const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (allowlist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

app.use(cors(corsOptionsDelegate));

const redisClient = redis.createClient();
app.use(
  session({
    name: "sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new RedisStore({ client: redisClient }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 2,
      sameSite: "strict",
    },
  })
);

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.render("error", { error: err });
});

app.use("/api/employee", empController);

app.use((req, res, next) => {
  res.status(404).json({
    status: 404,
    error: "Not found",
  });
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).send({
    error: {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    },
  });
});

app.listen(process.env.PORT, () =>
  console.log(`server running on port ${process.env.PORT}`)
);
