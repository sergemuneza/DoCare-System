const mongoose = require("mongoose");

const patientProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  nationalId: { type: String },
  insuranceNumber: { type: String },
  dateOfBirth: { type: Date },
  address: { type: String },
  phoneNumber: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("PatientProfile", patientProfileSchema);