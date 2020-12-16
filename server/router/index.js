const router = require("express").Router();

const {
  empRegister,
  adminLogin,
  currentUser,
  deleteSession,
  fasaxDalbasho,
  testRoute,
  empHistory,
  employee,
  userAuth,
  fetchAllEmps,
  deleteEmployee,
  uploadCv,
  editEmployee,
  addSubject,
  delHistory,
  delSubject,
  deleteDepartment,
  signContract,
  fetchAllEmployees,
  updateEmpImg,
  otherAttachmentFiels,
  delOtherAttachDocs,
} = require("../controllers/academic-employee");
const {
  fetchAdminEmployee,
  adminRegister,
  adminEmployee,
  deleteAdminEmployee,
  uploadCvFile,
  addRoles,
  editAdminEmployee,
  delRole,
  requestingAdminLeave,
  deleteAdminHistory,
  adminEmpHistory,
  signAdminContract,
  updateAdminImage,
  delAdminOtherAttachDocs,
  otherAdminAttachmentFiels,
} = require("../controllers/admins-employee");
const { isAuthenticated, isPublic } = require("../validators");
const upload = require("../helpers/multer");
const uploadDoc = require("../helpers/multer/docs-multer");
const {
  fetchSuppStaffEmployee,
  supportStaffRegister,
  suppStaffEmployee,
  editSupportStaff,
  supportStaffEmpHistory,
  getSupportStaffEmp,
  delSuppStaffHistory,
  deleteSuppStaffEmp,
  updateStaffImg,
  otherStaffAttachmentFiles,
  delOtherstaffAttachDocs,
  signStaffContract,
} = require("../controllers/support-staff");

router.post(
  "/register",
  isAuthenticated,
  upload.single("picture"),
  empRegister
);
router.put(
  "/update-emp-image",
  isAuthenticated,
  upload.single("picture"),
  updateEmpImg
);
router.put(
  "/update-staff-image",
  isAuthenticated,
  upload.single("picture"),
  updateStaffImg
);
router.put(
  "/update-admin-image",
  isAuthenticated,
  upload.single("picture"),
  updateAdminImage
);

router.post(
  "/register-supp-staff-employee",
  isAuthenticated,
  upload.single("picture"),
  supportStaffRegister
);
router.post("/login", adminLogin);
router.get("/session-delete", deleteSession);
router.get("/test", isPublic, testRoute);
router.get("/auth", isPublic, userAuth);
router.get("/", isAuthenticated, fetchAllEmps);
router.get("/fetchEmp", isAuthenticated, employee);
router.get("/fetch-supportstaff-employee", isAuthenticated, suppStaffEmployee);

router.get("/fetch-admin-employee", isAuthenticated, adminEmployee);
router.get("/fetch-admin-employees", isAuthenticated, fetchAdminEmployee);
router.put("/delete-employee", isAuthenticated, deleteEmployee);
router.delete("/delete-support-employee", isAuthenticated, deleteSuppStaffEmp);
router.put("/delete-admin-employee", isAuthenticated, deleteAdminEmployee);
router.put("/upload-cv", isAuthenticated, uploadDoc.single("cv_doc"), uploadCv);
router.put(
  "/upload-cv-file",
  isAuthenticated,
  uploadDoc.single("cv_doc"),
  uploadCvFile
);
router.put(
  "/other-files",
  isAuthenticated,
  uploadDoc.single("other_doc"),
  otherAttachmentFiels
);
router.put(
  "/other-staff-support-files",
  isAuthenticated,
  uploadDoc.single("other_doc"),
  otherAttachmentFiels
);

router.put(
  "/other-admin-files",
  isAuthenticated,
  uploadDoc.single("other_doc"),
  otherAdminAttachmentFiels
);

router.put(
  "/other-staff-files",
  isAuthenticated,
  uploadDoc.single("other_doc"),
  otherStaffAttachmentFiles
);

router.put("/other-delete-files", isAuthenticated, delOtherAttachDocs);
router.put(
  "/other-delete-staff-files",
  isAuthenticated,
  delOtherstaffAttachDocs
);
router.put("/delete-admin-files", isAuthenticated, delAdminOtherAttachDocs);

router.put("/fasax", isAuthenticated, fasaxDalbasho);
router.put("/admin-leave", isAuthenticated, requestingAdminLeave);
router.put("/support-staff-leave", isAuthenticated, supportStaffEmpHistory);
router.get("/history", isAuthenticated, empHistory);
router.get("/get-supportstaff-history", isAuthenticated, getSupportStaffEmp);
router.get("/admin-history", isAuthenticated, adminEmpHistory);
router.get("/get-all-employee", isAuthenticated, fetchAllEmployees);
router.get("/get-all-supportstaff", isAuthenticated, fetchSuppStaffEmployee);
router.put("/delete-history", isAuthenticated, delHistory);
router.put("/delete-admin-history", isAuthenticated, deleteAdminHistory);
router.put("/edit-employee", isAuthenticated, editEmployee);
router.put("/edit-admin-employee", isAuthenticated, editAdminEmployee);
router.put("/edit-support-staff-employee", isAuthenticated, editSupportStaff);
router.put("/delete-department", isAuthenticated, deleteDepartment);
router.put("/add-subject", isAuthenticated, addSubject);
router.put("/add-role", isAuthenticated, addRoles);
router.put("/delete-role", isAuthenticated, delRole);
router.put("/delete-subject", isAuthenticated, delSubject);
router.put(
  "/sign-contract",
  isAuthenticated,
  uploadDoc.single("cont_doc"),
  signContract
);

router.put(
  "/sign-staff-contract",
  isAuthenticated,
  uploadDoc.single("cont_doc"),
  signStaffContract
);

router.put(
  "/sign-admin-contract",
  isAuthenticated,
  uploadDoc.single("cont_doc"),
  signAdminContract
);
router.post(
  "/admin-register",
  isAuthenticated,
  upload.single("picture"),
  adminRegister
);

module.exports = router;
