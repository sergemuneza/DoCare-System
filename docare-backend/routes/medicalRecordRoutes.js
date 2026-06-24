const express = require("express");
const router = express.Router();
const {
  getMyMedicalRecords,
  getPatientMedicalRecords,
  createMedicalRecord
} = require("../controllers/medicalRecordController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.get("/my", protect, authorizeRoles("patient"), getMyMedicalRecords);
router.get("/:patientId", protect, authorizeRoles("doctor", "admin"), getPatientMedicalRecords);
router.post("/", protect, authorizeRoles("doctor"), createMedicalRecord);

module.exports = router;