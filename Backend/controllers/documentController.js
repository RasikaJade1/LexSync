// controllers/documentController.js
const Document = require("../models/documentModel");
const Case = require("../models/caseModel");

// Upload document
const uploadDocument = async (req, res) => {
  try {
    const { caseId, fileUrl, category, fileName } = req.body;
    if (!caseId || !fileUrl) return res.status(400).json({ message: "Case and file are required" });

    const caseExists = await Case.findById(caseId);
    if (!caseExists) return res.status(400).json({ message: "Linked case does not exist" });

    const newDoc = await Document.create({
      case: caseId,
      uploadedBy: req.user.id,
      fileUrl,
      category,
      fileName,
    });

    res.status(201).json(newDoc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error uploading document" });
  }
};

// Get documents by case
const getDocumentsByCase = async (req, res) => {
  try {
    const docs = await Document.find({ case: req.params.caseId })
      .populate("uploadedBy", "username")
      .populate("case", "title");

    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching documents" });
  }
};

module.exports = { uploadDocument, getDocumentsByCase };
