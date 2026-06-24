const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  appointmentDate: { type: Date, required: true },
  proposedDate: { type: Date, default: null },
proposedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  reason: { type: String },
  status: {
    type: String,
    enum: ["pending", "approved", "completed", "cancelled"],
    default: "pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);