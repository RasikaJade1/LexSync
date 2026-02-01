// const mongoose = require("mongoose");

// const caseSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: String,
//   status: { type: String, enum: ["active", "inactive", "closed"], default: "active" },
//   priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },

//   client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   lawyers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

//   openedOn: { type: Date, default: Date.now },
//   closedOn: Date,
// }, { timestamps: true });

// module.exports = mongoose.model("Case", caseSchema);

const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  // Match the status options from your Figma tags
  status: { type: String, enum: ["Active", "Review", "Pending", "Closed"], default: "Active" },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },

  client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lawyers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  // NEW: Field for "Next Hearing" shown in the table
  nextHearing: { type: Date },

  // NEW: Array for the "Rojnama" tab
  rojnama: [{
    date: { type: Date, default: Date.now },
    update: String,
    addedBy: String // e.g., "John Mitchell"
  }],

  // NEW: Array for the "Evidence" and "Documents" tabs
  files: [{
    name: String,
    url: String,
    category: { type: String, enum: ["evidence", "document"] },
    uploadedAt: { type: Date, default: Date.now }
  }],

  openedOn: { type: Date, default: Date.now },
  closedOn: Date,
}, { timestamps: true });

module.exports = mongoose.model("Case", caseSchema);