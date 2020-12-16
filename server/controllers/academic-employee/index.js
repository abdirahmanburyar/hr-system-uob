const {
  userRegistration,
  userLogIn,
} = require("../../helpers/validation/employee/validation");
const Employee = require("../../model/AcademicEmployee");
const ADminsEmployee = require("../../model/AdminsEmployee");
const Admins = require("../../model/admin");
const _ = require("lodash");
const moment = require("moment");
const AdminsEmployee = require("../../model/AdminsEmployee");
const SupportStaffEmp = require("../../model/SuppStaffEmployee");

module.exports.empRegister = async (req, res) => {
  try {
    const { errors, isValid } = userRegistration(req);
    if (isValid) return res.status(400).json(errors);

    if (!req.file)
      return res.status(400).json({ picture: "image is required" });
    let departName = req.body.department.split(",");
    let departObj = [];
    for (let i = 0; i < departName.length; i++) {
      const departNameObj = {
        name: departName[i],
      };
      departObj.push(departNameObj);
    }
    const emp = await new Employee({
      ...req.body,
      department: departObj,
      bod: moment(req.body.bod).format("L"),
      picture: req.file.path,
      createdBy: req.session.admin.role,
    });
    const newEmp = await emp.save();
    return res.status(201).json({ Emp: newEmp });
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
};

module.exports.addSubject = async (req, res) => {
  try {
    if (!req.session.admin && req.session.admin.role === "HR")
      return res.status(401).json({
        isAuth: false,
        msg: "your not logged in or denied permission",
      });
    const subject = await Employee.update(
      { _id: req.query.empId, "department._id": req.query.departId },
      {
        $push: {
          "department.$.subjects": req.body,
        },
      }
    );
    if (!subject) return res.status(500).json({ success: false });
    return res.status(201).json({ success: true });
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
};

module.exports.delSubject = async (req, res) => {
  try {
    if (!req.session.admin && req.session.admin.role === "HR")
      return res.status(401).json({
        isAuth: false,
        msg: "your not logged in or denied permission",
      });
    const subject = await Employee.update(
      {
        _id: req.query.empId,
        "department._id": req.query.departId,
      },
      {
        $pull: {
          "department.$[].subjects": { _id: req.query.subjectId },
        },
      }
    );
    if (!subject) return res.status(500).json({ success: false });
    return res.status(201).json({ success: true });
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
};

module.exports.editEmployee = async (req, res) => {
  try {
    if (!req.session.admin && req.session.admin.role === "HR")
      return res.status(401).json({
        isAuth: false,
        msg: "your not logged in or denied permission",
      });
    const edited = await Employee.updateOne(
      { _id: req.query.empId },
      {
        $set: { ...req.body },
      }
    );
    if (!edited) return res.status(400).json({ success: false });
    return res.status(200).json({ success: true, status: 201 });
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
};

module.exports.fetchAllEmployees = async (req, res) => {
  try {
    if (
      !req.session.admin ||
      !req.session.admin.role === "HR" ||
      !req.session.admin.role === "deputy director"
    )
      return res.status(401).json({
        isAuth: false,
        msg: "your not logged in or permission denied",
      });
    const acadeEmployee = await Employee.find({ isDeleted: false });
    const adminsEmployee = await AdminsEmployee.find({ isDeleted: false });
    const supportStaffEmp = await SupportStaffEmp.find({ isDeleted: false });
    return res.status(200).json({
      adminsEmployee: adminsEmployee.length,
      acadeEmployee: acadeEmployee.length,
      supportStaffEmp: supportStaffEmp.length,
    });
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
};

module.exports.updateEmpImg = async (req, res) => {
  try {
    if (!req.session.admin && req.session.admin.role === "HR")
      return res.status(401).json({
        isAuth: false,
        msg: "your not logged in or denied permission",
      });

    if (!req.file)
      return res.status(400).json({ msg: "only image is required" });
    const upload = await Employee.updateOne(
      { _id: req.query.empId },
      {
        $set: { picture: req.file.path },
      }
    );
    if (!upload) return res.status(400).json({ success: false });
    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
};

module.exports.signContract = async (req, res) => {
  try {
    if (!req.session.admin && req.session.admin.role === "HR")
      return res.status(401).json({
        isAuth: false,
        msg: "your not logged in or denied permission",
      });
    if (!req.file) return res.status(400).json({ msg: "only pdf is required" });
    const edited = await Employee.updateOne(
      { _id: req.query.empId },
      {
        $set: {
          contract: {
            signed: true,
            signedDate: moment(new Date()).format("L"),
            contract_doc: req.file.path,
          },
        },
      }
    );
    if (!edited) return res.status(400).json({ success: false });
    return res.status(200).json({ success: true, status: 201 });
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
};

module.exports.uploadCv = async (req, res) => {
  try {
    if (!req.session.admin && req.session.admin.role === "HR")
      return res.status(401).json({
        isAuth: false,
        msg: "your not logged in or denied permission",
      });
    if (!req.file) return res.status(400).json({ pdf: "only pdf is required" });
    const upload = await Employee.updateOne(
      { _id: req.query.q },
      {
        $set: { cv: req.file.path },
      }
    );
    if (!upload) return res.status(400).json({ success: false });
    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
};

module.exports.adminLogin = async (req, res) => {
  try {
    const { errors, isValid } = userLogIn(req);
    if (isValid) return res.status(400).json(errors);
    const admin = await Admins.findOne({ email: req.body.email });
    if (!admin)
      return res.status(404).json({ msg: "No such Account with this Email" });
    let isMatched = await admin.comparePass(req.body.password);
    if (!isMatched) return res.status(400).json({ msg: "Invalid Credential" });
    req.session.admin = _.pick(admin, ["email", "_id", "fullName", "role"]);
    return res.status(200).json({
      admin: _.pick(admin, ["fullName", "email", "_id", "firstName", "role"]),
    });
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
};

module.exports.fetchAllEmps = async (req, res) => {
  try {
    if (
      !req.session.admin ||
      !req.session.admin.role === "HR" ||
      !req.session.admin.role === "deputy director"
    )
      return res.status(401).json({
        isAuth: false,
        msg: "your not logged in or permission denied",
      });
    let fetchEmp = await Employee.find({
      // createdBy: req.session.admin.role,
      isDeleted: req.query.tag && req.query.tag === "active" ? false : true,
    }).then((docs) =>
      docs.map((doc) => ({
        ...doc._doc,
        fullName: `${doc._doc.firstName} ${doc._doc.middleName} ${doc._doc.surname}`,
      }))
    );
    if (!fetchEmp) return res.status(204).json({ employee: "0 Employees" });
    return res.status(200).json(fetchEmp);
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
};

module.exports.employee = async (req, res) => {
  try {
    if (
      !req.session.admin ||
      !req.session.admin.role === "HR" ||
      !req.session.admin.role === "deputy director"
    )
      return res.status(401).json({
        isAuth: false,
        msg: "your not logged in or permission denied",
      });
    const fetchEmp = await Employee.findOne({ _id: req.query.q });
    if (!fetchEmp) return res.status(204).json("not found");
    return res.status(200).json(fetchEmp);
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
};

module.exports.empHistory = async (req, res) => {
  try {
    console.log(req.session.admin);
    if (
      !req.session.admin ||
      req.session.admin.role !== "HR" ||
      req.session.admin.role !== "deputy director"
    )
      return res.status(401).json({
        isAuth: false,
        msg: "your not logged in or permission denied",
      });
    const fetchEmp = await Employee.findOne({ _id: req.query.empId });
    if (!fetchEmp) return res.status(204).json("not found");
    return res.status(200).json({ history: _.pick(fetchEmp, ["fasax"]) });
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
};

module.exports.deleteEmployee = async (req, res) => {
  try {
    if (!req.session.admin || !req.session.admin.role === "HR")
      return res.status(401).json({
        isAuth: false,
        msg: "your not logged in or permission denied",
      });
    const delEmp = await Employee.updateOne(
      { _id: req.query.q },
      {
        $set: {
          isDeleted: req.query.deleted && req.query.deleted,
          updatedAt: new Date(),
        },
      }
    );
    if (!delEmp) return res.status(500).json({ msg: "something went wrong" });
    return res.status(200).json({ isDeleted: true });
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
};

module.exports.delHistory = async (req, res) => {
  try {
    if (!req.session.admin || req.session.admin.role !== "HR")
      return res.status(401).json({
        isAuth: false,
        msg: "your not logged in or permission denied",
      });
    const _id = req.query.empId;
    const elId = req.query.historyId;
    const deleteHistory = await Employee.update(
      { _id },
      {
        $pull: { fasax: { _id: elId } },
      }
    );
    if (!deleteHistory)
      return res.status(500).json({ msg: "something went wrong" });
    return res.status(200).json({ isDeleted: true });
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
};

module.exports.delOtherAttachDocs = async (req, res) => {
  try {
    if (!req.session.admin || req.session.admin.role !== "HR")
      return res.status(401).json({
        isAuth: false,
        msg: "your not logged in or permission denied",
      });
    const _id = req.query.empId;
    const docId = req.query.docId;
    const deleterDoc = await Employee.update(
      { _id },
      {
        $pull: { otherAttachment: { _id: docId } },
      }
    );
    if (!deleterDoc)
      return res.status(500).json({ msg: "something went wrong" });
    return res.status(200).json({ isDeleted: true });
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
};

module.exports.deleteDepartment = async (req, res) => {
  try {
    if (!req.session.admin && req.session.admin.role === "HR")
      return res.status(401).json({
        isAuth: false,
        msg: "your not logged in or denied permission",
      });
    const _id = req.query.empId;
    const departIndx = req.query.indx;
    const delDepart = await Employee.update(
      { _id },
      {
        $pull: { department: { _id: departIndx } },
      }
    );
    if (!delDepart)
      return res.status(500).json({ msg: "something went wrong" });
    return res.status(200).json({ isDeleted: true });
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
};

module.exports.fasaxDalbasho = async (req, res) => {
  try {
    const error = {};
    if (!req.body) {
      error.body = "is required";
      return res.status(400).json({ error });
    }
    if (!req.body.from) {
      error.from = "is required";
      return res.status(400).json({ error });
    }
    if (!req.body.to) {
      error.to = "is required";
      return res.status(400).json({ error });
    }
    if (!req.body.description) {
      error.description = "is required";
      return res.status(400).json({ error });
    }
    if (!req.session.admin && req.session.admin.role === "HR")
      return res.status(401).json({
        isAuth: false,
        msg: "your not logged in or denied permission",
      });
    const pushDate = await Employee.updateOne(
      { _id: req.query.empId },
      {
        $push: {
          fasax: [
            {
              from: moment(req.body.from).format("L"),
              to: moment(req.body.to).format("L"),
              description: req.body.description,
            },
          ],
        },
      }
    );
    if (!pushDate) return res.status(500).json({ msg: "something went wrong" });
    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
};

module.exports.otherAttachmentFiels = async (req, res) => {
  try {
    if (!req.session.admin && req.session.admin.role === "HR")
      return res.status(401).json({
        isAuth: false,
        msg: "your not logged in or denied permission",
      });
    if (!req.file) return res.status(400).json({ msg: "only pdf is required" });
    if (!req.body.title) {
      return res.status(400).json({ msg: "Title is required" });
    }
    const pushDate = await Employee.updateOne(
      { _id: req.query.empId },
      {
        $push: {
          otherAttachment: [
            {
              other_doc: req.file.path,
              title: req.body.title,
            },
          ],
        },
      }
    );
    if (!pushDate) return res.status(500).json({ msg: "something went wrong" });
    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
};

module.exports.deleteSession = async (req, res) => {
  try {
    const admin = req.session.admin;
    if (admin) {
      req.session.destroy((err) => {
        if (err) throw err;
        res.clearCookie("sid");
        return res.status(200).json({ msg: "successfuly logout" });
      });
    } else {
      return res.status(500).json({ msg: "something went wrong" });
    }
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
};

module.exports.userAuth = async (req, res, next) => {
  const { admin } = req.session;
  if (!admin)
    return res.status(401).json({ isAuth: false, msg: "your are logged out" });
  return res.status(200).json({ isAuth: true });
};
module.exports.testRoute = async (req, res) => {
  const users = await admin.find({});
  if (!users) return res.json({ err });
  return res.json(users[0]);
};
