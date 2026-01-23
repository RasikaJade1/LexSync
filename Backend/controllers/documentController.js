const Document = require("../models/documentModel");
const Case = require("../models/caseModel");
const cloudinary = require('../config/cloudinary');
const fs = require('fs').promises;  // For temp file cleanup

// Upload document (now handles actual file)
const uploadDocument = async (req, res) => {
  try {
    const { caseId, category } = req.body;
    if (!req.file || !caseId) {
      return res.status(400).json({ message: "File and caseId are required" });
    }

    // Validate case exists
    const caseExists = await Case.findById(caseId);
    if (!caseExists) {
      return res.status(400).json({ message: "Linked case does not exist" });
    }

    // Auto-detect resource type
    const resourceType = req.file.mimetype.startsWith('image/') ? 'image' :
                         req.file.mimetype.startsWith('video/') ? 'video' : 'raw';

    // Upload to Cloudinary
    const uploadOptions = {
      folder: `lawfirm/cases/${caseId}/${category || 'general'}`,
      resource_type: resourceType,
      public_id: `doc-${Date.now()}-${req.user.id}`,  // Unique ID
      context: {
        caseId,
        clientId: caseExists.client,
        uploadedBy: req.user.id,
        sensitive: category === 'confidential' ? 'true' : 'false',  // Custom tag
      },
      // Optional transformations (only for media)
      ...(resourceType === 'image' && {
        eager: [
          { width: 800, height: 600, crop: 'limit', format: 'jpg', quality: 'auto' },  // Optimized thumbnail
        ],
      }),
      ...(resourceType === 'video' && {
        eager: [{ quality: 'auto', format: 'mp4' }],  // Compress video
      }),
    };

    const result = await cloudinary.uploader.upload(req.file.path, uploadOptions);

    // Cleanup temp file
    await fs.unlink(req.file.path);

    // Create DB record
    const newDoc = await Document.create({
      case: caseId,
      uploadedBy: req.user.id,
      fileUrl: result.secure_url,  // Cloudinary URL
      category,
      originalName: req.file.originalname,
      // Optional: Store public_id for deletes
      publicId: result.public_id,
    });

    res.status(201).json({
      message: 'Document uploaded successfully',
      document: newDoc,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    console.error('Upload error:', err);
    if (req.file) await fs.unlink(req.file.path).catch(console.error);  // Cleanup on error
    res.status(500).json({ message: "Error uploading document", details: err.message });
  }
};

// Get documents by case (unchanged, but now URLs are Cloudinary)
// Get documents by case (now with role-based access checks)
const getDocumentsByCase = async (req, res) => {
  try {
    const { caseId } = req.params;

    // Fetch the case first to validate access
    const caseData = await Case.findById(caseId)
      .populate("client", "username")
      .populate("lawyers", "username");

    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }

    // Role-based access check
    const userRole = req.user.role;
    if (userRole === "client" && caseData.client._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied: Not your case" });
    }
    if (userRole === "lawyer" && !caseData.lawyers.some(l => l._id.toString() === req.user.id)) {
      return res.status(403).json({ message: "Access denied: Not assigned to this case" });
    }
    // Admin: Full access, no check needed

    // Fetch docs for the case (all if authorized)
    const docs = await Document.find({ case: caseId })
      .populate("uploadedBy", "username")
      .populate("case", "title")
      .sort({ createdAt: -1 });  // Optional: Newest first

    // Optional: Add thumbnails for images (as before)
    const docsWithThumbs = docs.map(doc => ({
      ...doc.toObject(),
      thumbnail: doc.category?.startsWith('image') 
        ? cloudinary.url(doc.publicId, { transformation: [{ width: 200, height: 200, crop: 'thumb' }] })
        : null,
    }));

    res.json(docsWithThumbs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching documents" });
  }
};

// Bonus: Delete document (add if needed)
const deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc || doc.case.toString() !== req.params.caseId) {
      return res.status(404).json({ message: "Document not found" });
    }
    // Check access (e.g., uploader or admin)
    if (doc.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }

    await cloudinary.uploader.destroy(doc.publicId);
    await Document.findByIdAndDelete(req.params.id);

    res.json({ message: 'Document deleted' });
  } catch (err) {
    res.status(500).json({ message: "Error deleting document" });
  }
};

module.exports = { uploadDocument, getDocumentsByCase, deleteDocument };