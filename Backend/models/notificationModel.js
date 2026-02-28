// models/notificationModel.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Who gets the alert
  message: { type: String, required: true },
  type: { type: String, enum: ['case', 'appointment', 'rojnama', 'system'] },
  isRead: { type: Boolean, default: false },
  relatedId: { type: mongoose.Schema.Types.ObjectId } // Links to the specific case/appointment
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);