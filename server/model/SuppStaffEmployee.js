const { Schema, model } = require("mongoose");
const suppStaffSchema = new Schema(
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
    damiin: {
      type: String,
    },
    occupation: {
      erquired: true,
      type: String,
    },
    bod: {
      type: String,
      required: true,
    },
    otherAttachment: [
      {
        other_doc: { type: String },
        title: { type: String },
      },
    ],
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
    acc_no: {
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
    basicSalary: {
      required: true,
      type: Number,
    },
    address: {
      required: true,
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

module.exports = model("support-staff", suppStaffSchema);
