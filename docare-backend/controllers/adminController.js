const User = require("../models/User");
const Document = require("../models/Document");
const Appointment = require("../models/Appointment");
const DocumentRequest = require("../models/DocumentRequest");
const MedicalRecord = require("../models/MedicalRecord");
const DoctorProfile = require("../models/DoctorProfile");
const PatientProfile = require("../models/PatientProfile");
const ActivityLog = require("../models/ActivityLog");

const getStats = async (req, res) => {
  try {
    const [
      totalPatients, totalDoctors, totalDocuments,
      totalRequests, totalAppointments, totalRecords,
      pendingRequests, pendingAppointments
    ] = await Promise.all([
      User.countDocuments({ role: "patient" }),
      User.countDocuments({ role: "doctor" }),
      Document.countDocuments(),
      DocumentRequest.countDocuments(),
      Appointment.countDocuments(),
      MedicalRecord.countDocuments(),
      DocumentRequest.countDocuments({ status: "pending" }),
      Appointment.countDocuments({ status: "pending" })
    ]);
    res.json({
      totalPatients, totalDoctors, totalDocuments,
      totalRequests, totalAppointments, totalRecords,
      pendingRequests, pendingAppointments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserDetail = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    let profile = null;
    if (user.role === "patient") {
      profile = await PatientProfile.findOne({ user: user._id });
    } else if (user.role === "doctor") {
      profile = await DoctorProfile.findOne({ user: user._id });
    }

    res.json({ ...user.toObject(), profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    await ActivityLog.create({
      admin: req.user._id,
      action: `Changed role to ${req.body.role}`,
      target: user.name,
      details: `New role: ${req.body.role}`,
      type: "role_changed"
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot delete an admin account" });
    }
    await ActivityLog.create({
      admin: req.user._id,
      action: `Deleted ${user.role} account`,
      target: user.name,
      details: `Email: ${user.email}`,
      type: "user_deleted"
    });
    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find()
      .populate("patient", "name email")
      .populate("uploadedBy", "name role")
      .sort({ createdAt: -1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate("patient", "name");
    if (!document) return res.status(404).json({ message: "Document not found" });

    await ActivityLog.create({
      admin: req.user._id,
      action: `Deleted document`,
      target: document.fileName || "Unknown file",
      details: `Type: ${document.documentType}, Patient: ${document.patient?.name || "Unknown"}`,
      type: "document_deleted"
    });

    await document.deleteOne();
    res.json({ message: "Document deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "name email")
      .populate("doctor", "name email")
      .sort({ appointmentDate: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getActivityLog = async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate("admin", "name email")
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStats, getAllUsers, getUserDetail,
  updateUserRole, deleteUser,
  getAllDocuments, deleteDocument,
  getAllAppointments, getActivityLog
};
