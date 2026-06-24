const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  target: { type: String },
  details: { type: String },
  type: {
    type: String,
    enum: ["user_created", "user_deleted", "role_changed",
           "document_deleted", "status_changed", "general"],
    default: "general"
  }
}, { timestamps: true });

module.exports = mongoose.model("ActivityLog", activityLogSchema);