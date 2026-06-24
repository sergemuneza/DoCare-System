// const mongoose = require("mongoose");

// const notificationSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   title: { type: String, required: true },
//   message: { type: String, required: true },
//   type: {
//     type: String,
//     enum: ["request_approved", "request_rejected", "appointment_approved",
//            "appointment_cancelled", "document_uploaded", "general"],
//     default: "general"
//   },
//   read: { type: Boolean, default: false }
// }, { timestamps: true });

// module.exports = mongoose.model("Notification", notificationSchema);
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: [
      "request_approved", "request_rejected",
      "appointment_approved", "appointment_cancelled",
      "document_uploaded", "request_uploaded", "general"
    ],
    default: "general"
  },
  link: { type: String, default: null },
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document",
    default: null
  },
  read: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);