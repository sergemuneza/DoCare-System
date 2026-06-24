const express = require("express");
const router = express.Router();
const {
  getStats, getAllUsers, getUserDetail,
  updateUserRole, deleteUser,
  getAllDocuments, deleteDocument,
  getAllAppointments
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const admin = [protect, authorizeRoles("admin")];

router.get("/stats", ...admin, getStats);
router.get("/users", ...admin, getAllUsers);
router.get("/users/:id", ...admin, getUserDetail);
router.put("/users/:id/role", ...admin, updateUserRole);
router.delete("/users/:id", ...admin, deleteUser);
router.get("/documents", ...admin, getAllDocuments);
router.delete("/documents/:id", ...admin, deleteDocument);
router.get("/appointments", ...admin, getAllAppointments);

//---
const bcrypt = require("bcrypt");

const { getActivityLog } = require("../controllers/adminController");
router.get("/activity-log", ...admin, getActivityLog);

// router.post("/users", ...admin, async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     const exists = await require("../models/User").findOne({ email });
//     if (exists) return res.status(400).json({ message: "Email already exists" });

//     const salt = await bcrypt.genSalt(10);
//     const hashed = await bcrypt.hash(password, salt);

//     const user = await require("../models/User").create({
//       name, email, password: hashed, role: role || "doctor"
//     });

//     if (role === "patient") {
//       await require("../models/PatientProfile").create({ user: user._id });
//     } else if (role === "doctor") {
//       await require("../models/DoctorProfile").create({ user: user._id });
//     }

//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
router.post("/users", ...admin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const bcrypt = require("bcrypt");
    const ActivityLog = require("../models/ActivityLog");

    const exists = await require("../models/User").findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await require("../models/User").create({
      name, email, password: hashed, role: role || "doctor"
    });

    if (role === "patient") {
      await require("../models/PatientProfile").create({ user: user._id });
    } else if (role === "doctor") {
      await require("../models/DoctorProfile").create({ user: user._id });
    }

    await ActivityLog.create({
      admin: req.user._id,
      action: `Created new ${role} account`,
      target: name,
      details: `Email: ${email}, Role: ${role}`,
      type: "user_created"
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;