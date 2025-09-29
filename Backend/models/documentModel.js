// models/Document.js
const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  case: { type: mongoose.Schema.Types.ObjectId, ref: "Case", required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fileUrl: { type: String, required: true }, // S3/local path
  category: { type: String }, // “Evidence”, “Contract” etc.
  originalName: String,
}, { timestamps: true });

module.exports = mongoose.model("Document", documentSchema);
