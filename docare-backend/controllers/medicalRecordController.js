const MedicalRecord = require("../models/MedicalRecord");

const getMyMedicalRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patient: req.user._id })
      .populate("doctor", "name email")
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPatientMedicalRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patient: req.params.patientId })
      .populate("doctor", "name email")
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const createMedicalRecord = async (req, res) => {
//   try {
//     const { patientId, diagnosis, notes, visitDate } = req.body;
//     const record = await MedicalRecord.create({
//       patient: patientId,
//       doctor: req.user._id,
//       diagnosis,
//       notes,
//       visitDate: visitDate || Date.now()
//     });
//     res.status(201).json(record);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
const Notification = require("../models/Notification");

const createMedicalRecord = async (req, res) => {
  try {
    const { patientId, diagnosis, notes, visitDate } = req.body;

    const record = await MedicalRecord.create({
      patient: patientId,
      doctor: req.user._id,
      diagnosis,
      notes,
      visitDate: visitDate || Date.now()
    });

    await Notification.create({
      user: patientId,
      title: "New medical record added",
      message: `Dr. ${req.user.name} has added a new medical record: "${diagnosis}". Click to view your medical history.`,
      type: "general",
      link: "/patient/records"
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMyMedicalRecords, getPatientMedicalRecords, createMedicalRecord };