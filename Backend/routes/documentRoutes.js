const express = require("express");
const { uploadDocument, getDocumentsByCase, deleteDocument } = require("../controllers/documentController");
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const upload = require("../middlewares/multer");  // Your new Multer

const router = express.Router();

router.post("/", verifyToken, authorizeRoles("admin", "lawyer"), upload.single('file'), uploadDocument);  // 'file' is form field name
router.get("/case/:caseId", verifyToken, authorizeRoles("admin", "lawyer", "client"), getDocumentsByCase);
router.delete("/:id/case/:caseId", verifyToken, authorizeRoles("admin", "lawyer"), deleteDocument);  // New delete

module.exports = router;