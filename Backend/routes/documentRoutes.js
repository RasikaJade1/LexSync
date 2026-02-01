const express = require("express");
const { 
    uploadDocument, 
    getDocumentsByCase, 
    deleteDocument 
} = require("../controllers/documentController");

const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const upload = require("../middlewares/multer"); // Your Multer configuration

const router = express.Router();

/**
 * @route   POST /api/documents/
 * @desc    Upload a document to Cloudinary (LexSync folder)
 * @access  Admin, Lawyer
 */
router.post(
    "/", 
    verifyToken, 
    authorizeRoles("admin", "lawyer"), 
    upload.single('file'), // 'file' must match the key in your Frontend FormData
    uploadDocument
);

/**
 * @route   GET /api/documents/case/:caseId
 * @desc    Fetch all documents linked to a specific case
 * @access  Admin, Lawyer, Client
 */
router.get(
    "/case/:caseId", 
    verifyToken, 
    authorizeRoles("admin", "lawyer", "client"), 
    getDocumentsByCase
);

/**
 * @route   DELETE /api/documents/:id/case/:caseId
 * @desc    Delete a document from Cloudinary and MongoDB
 * @access  Admin, Lawyer
 */
router.delete(
    "/:id/case/:caseId", 
    verifyToken, 
    authorizeRoles("admin", "lawyer"), 
    deleteDocument
);

module.exports = router;