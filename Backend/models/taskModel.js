// models/Task.js
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  case: { type: mongoose.Schema.Types.ObjectId, ref: "Case" },
  title: { type: String, required: true },
  description: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  deadline: Date,
  status: { type: String, enum: ["pending", "in-progress", "done"], default: "pending" },
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
