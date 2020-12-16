const {
  adminRegister,
} = require("../../helpers/validation/employee/validation");
const SuppStaffEmployee = require("../../model/SuppStaffEmployee");
const _ = require("lodash");
const moment = require("moment");

module.exports.supportStaffRegister = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ picture: "image is required" });
    const emp = await new SuppStaffEmployee({
      ...req.body,
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

module.exports.addRoles = async (req, res) => {
  try {
    if (!req.session.admin && req.session.admin.role === "HR")
      return res.status(401).json({
        isAuth: false,
        msg: "your not logged in or denied permission",
      });
    const roles = await SuppStaffEmployee.update(
      { _id: req.query.empId },
      {
        $push: {
          section: req.body,
        },
      }
    );
    if (!roles) return res.status(400).json({ success: false });
    return res.status(201).json({ success: true });
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
};

module.exports.delRole = async (req, res) => {
  try {
    if (!req.session.admin && req.session.admin.role === "HR")
      return res.status(401).json({
        isAuth: false,
        msg: "your not logged in or denied permission",
      });
    const subject = await SuppStaffEmployee.update(
      {
        _id: req.query.empId,
      },
      {
        $pull: {
          section: { _id: req.query.roleId },
        },
      }
    );
    if (!subject) return res.status(400).json({ success: false });
    return res.status(201).json({ success: true });
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
};

module.exports.supportStaffEmpHistory = async (req, res) => {
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
    const pushDate = await SuppStaffEmployee.update(
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

module.exports.updateStaffImg = async (req, res) => {
  try {
    if (!req.session.admin && req.session.admin.role === "HR")
      return res.status(401).json({
        isAuth: false,
        msg: "your not logged in or denied permission",
      });

    if (!req.file)
      return res.status(400).json({ msg: "only image is required" });
    const upload = await SuppStaffEmployee.updateOne(
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

module.exports.getSupportStaffEmp = async (req, res) => {
  if (!req.session.admin && req.session.admin.role === "HR")
    return res
      .status(401)
      .json({ isAuth: false, msg: "your not logged in or denied permission" });
  try {
    const fetchEmp = await SuppStaffEmployee.findOne({ _id: req.query.empId });
    if (!fetchEmp) return res.status(204).json("not found");
    return res.status(200).json({ history: _.pick(fetchEmp, ["fasax"]) });
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
};

module.exports.otherStaffAttachmentFiles = async (req, res) => {
  try {
    if (!req.session.admin && req.session.admin.role === "HR")
      return res.status(401).json({
        isAuth: false,
        msg: "your not logged in or permission denied",
      });
    if (!req.file) return res.status(400).json({ msg: "only pdf is required" });
    if (!req.body.title) {
      return res.status(400).json({ msg: "Title is required" });
    }
    const pushDate = await SuppStaffEmployee.updateOne(
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

module.exports.delOtherstaffAttachDocs = async (req, res) => {
  try {
    if (!req.session.admin || req.session.admin.role !== "HR")
      return res.status(401).json({
        isAuth: false,
        msg: "your not logged in or permission denied",
      });
    const _id = req.query.empId;
    const docId = req.query.docId;
    const deleterDoc = await SuppStaffEmployee.update(
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

module.exports.signStaffContract = async (req, res) => {
  try {
    if (!req.session.admin && req.session.admin.role === "HR")
      return res.status(401).json({
        isAuth: false,
        msg: "your not logged in or denied permission",
      });
    if (!req.file) return res.status(400).json({ msg: "only pdf is required" });
    const edited = await SuppStaffEmployee.updateOne(
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

module.exports.deleteSuppStaffEmp = async (req, res) => {
  try {
    if (!req.session.admin && req.session.admin.role === "HR")
      return res.status(401).json({
        isAuth: false,
        msg: "your are not logged in or permission denied",
      });
    const delEmp = await SuppStaffEmployee.updateOne(
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

module.exports.delSuppStaffHistory = async (req, res) => {
  try {
    if (!req.session.admin && req.session.admin.role === "HR")
      return res.status(401).json({
        isAuth: false,
        msg: "your not logged in or denied permission",
      });
    const _id = req.query.empId;
    const elId = req.query.historyId;
    const deleteHistory = await SuppStaffEmployee.update(
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

module.exports.editSupportStaff = async (req, res) => {
  try {
    if (!req.session.admin && req.session.admin.role === "HR")
      return res.status(401).json({
        isAuth: false,
        msg: "your not logged in or denied permission",
      });
    console.log(req.body);
    const edited = await SuppStaffEmployee.updateOne(
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

module.exports.fetchSuppStaffEmployee = async (req, res) => {
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
    let fetchEmp = await SuppStaffEmployee.find({
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

module.exports.suppStaffEmployee = async (req, res) => {
  if (!req.session.admin && req.session.admin.role === "HR")
    return res
      .status(401)
      .json({ isAuth: false, msg: "your not logged in or denied permission" });
  try {
    const fetchEmp = await SuppStaffEmployee.findOne({ _id: req.query.q });
    if (!fetchEmp) return res.status(204).json("not found");
    return res.status(200).json(fetchEmp);
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
};
