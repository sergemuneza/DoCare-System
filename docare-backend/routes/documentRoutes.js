const express = require("express");
const router = express.Router();
const {
  uploadDocument,
  getMyDocuments,
  getPatientDocuments,
  deleteDocument
} = require("../controllers/documentController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post(
  "/upload",
  protect,
  authorizeRoles("doctor", "admin"),
  upload.single("file"),
  uploadDocument
);

router.get(
  "/my",
  protect,
  authorizeRoles("patient"),
  getMyDocuments
);

router.get(
  "/patient/:patientId",
  protect,
  authorizeRoles("doctor", "admin"),
  getPatientDocuments
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteDocument
);

module.exports = router;