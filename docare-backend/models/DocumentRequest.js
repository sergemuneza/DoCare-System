const mongoose = require("mongoose");

const documentRequestSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  documentType: { type: String, required: true },
  reason: { type: String },
  status: {
    type: String,
    enum: ["pending", "uploaded", "approved", "rejected"],
    default: "pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("DocumentRequest", documentRequestSchema);