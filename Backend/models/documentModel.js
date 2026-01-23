const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  case: { type: mongoose.Schema.Types.ObjectId, ref: "Case", required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fileUrl: { type: String, required: true },
  publicId: { type: String },  // New: Cloudinary ID
  category: { type: String },
  originalName: String,
}, { timestamps: true });

module.exports = mongoose.model("Document", documentSchema);