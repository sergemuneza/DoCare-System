const mongoose = require("mongoose");

const doctorProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  specialization: { type: String, default: "" },
  phoneNumber: { type: String, default: "" },
  officeAddress: { type: String, default: "" },
  licenseNumber: { type: String, default: "" },
  yearsOfExperience: { type: Number, default: 0 },
  workingHours: { type: String, default: "" },
  biography: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("DoctorProfile", doctorProfileSchema);