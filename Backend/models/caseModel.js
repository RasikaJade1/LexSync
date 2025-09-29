const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ["active", "inactive", "closed"], default: "active" },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },

  client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lawyers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  openedOn: { type: Date, default: Date.now },
  closedOn: Date,
}, { timestamps: true });

module.exports = mongoose.model("Case", caseSchema);
