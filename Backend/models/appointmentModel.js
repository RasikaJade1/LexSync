// models/appointmentModel.js
const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['consultation', 'hearing', 'deposition', 'mediation', 'meeting'] },
  date: { type: Date, required: true },
  time: String,
  duration: String,
  location: String,
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: "Case" }, // Link to a case
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Link to users
  description: String,
  status: { type: String, enum: ['scheduled', 'confirmed', 'pending', 'completed', 'cancelled'], default: 'scheduled' }
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);