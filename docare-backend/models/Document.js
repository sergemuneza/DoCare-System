const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  documentType: {
    type: String,
    enum: ["medical_record", "lab_result", "prescription", "radiology", "invoice", "insurance", "referral_letter"],
    required: true
  },
  filePath: { type: String, required: true },
  fileName: { type: String },
  description: { type: String, default: "" },
  relatedRequest: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "DocumentRequest",
  default: null
},
  status: { type: String, enum: ["active", "archived"], default: "active" }
}, { timestamps: true });

module.exports = mongoose.model("Document", documentSchema);