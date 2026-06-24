
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const User = require("../models/User");
const PatientProfile = require("../models/PatientProfile");
const DoctorProfile = require("../models/DoctorProfile");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);

router.get("/patients", protect, authorizeRoles("doctor", "admin"), async (req, res) => {
  try {
    const patients = await User.find({ role: "patient" }).select("_id name email");
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/doctors", protect, authorizeRoles("patient", "admin"), async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("_id name email");
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    let profile = null;
    if (req.user.role === "patient") {
      profile = await PatientProfile.findOne({ user: req.user._id });
    } else if (req.user.role === "doctor") {
      profile = await DoctorProfile.findOne({ user: req.user._id });
    }
    res.json({ ...user.toObject(), profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/profile", protect, async (req, res) => {
  try {
    const { name, phoneNumber, officeAddress, dateOfBirth,
      insuranceNumber, nationalId, address,
      specialization, licenseNumber, yearsOfExperience,
      workingHours, biography } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name },
      { new: true }
    ).select("-password");

    if (req.user.role === "patient") {
      await PatientProfile.findOneAndUpdate(
        { user: req.user._id },
        { phoneNumber, address, dateOfBirth, insuranceNumber, nationalId },
        { new: true, upsert: true }
      );
    } else if (req.user.role === "doctor") {
      await DoctorProfile.findOneAndUpdate(
        { user: req.user._id },
        { specialization, phoneNumber, officeAddress,
          licenseNumber, yearsOfExperience, workingHours, biography },
        { new: true, upsert: true }
      );
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/doctors/details", protect, async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("_id name email");
    const profiles = await DoctorProfile.find();
    const result = doctors.map((d) => {
      const profile = profiles.find((p) => p.user.toString() === d._id.toString());
      return { ...d.toObject(), profile };
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/complete-profile", async (req, res) => {
  try {
    const {
      userId, token,
      phoneNumber, dateOfBirth,
      address, nationalId, insuranceNumber
    } = req.body;

    await PatientProfile.findOneAndUpdate(
      { user: userId },
      { phoneNumber, dateOfBirth, address, nationalId, insuranceNumber },
      { new: true, upsert: true }
    );

    res.json({ message: "Profile completed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//---
router.put("/change-password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/patients/search", protect, authorizeRoles("doctor", "admin"), async (req, res) => {
  try {
    const { q } = req.query;
    const patients = await User.find({
      role: "patient",
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } }
      ]
    }).select("_id name email createdAt");
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;