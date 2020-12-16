const { Schema, model } = require("mongoose");
const employeeSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    certs: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    picture: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    status: {
      required: true,
      type: String,
      default: "Active",
    },
    department: [
      {
        name: { type: String },
        subjects: [
          {
            subject: String,
            price: Number,
          },
        ],
      },
    ],
    bod: {
      type: String,
      required: true,
    },
    fasax: [
      {
        from: { type: Date },
        to: { type: Date },
        description: { type: String },
      },
    ],
    otherAttachment: [
      {
        other_doc: { type: String },
        title: { type: String },
      },
    ],
    address: {
      required: true,
      type: String,
    },
    acc_no: {
      required: true,
      type: String,
    },
    contract: {
      signed: {
        type: Boolean,
        default: false,
      },
      signedDate: {
        type: String,
      },
      contract_doc: { type: String },
    },
    cv: {
      type: String,
    },
    createdBy: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = model("Employee", employeeSchema);
