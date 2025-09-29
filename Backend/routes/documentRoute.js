// routes/documentRoutes.js
const express = require("express");
const { uploadDocument, getDocumentsByCase } = require("../controllers/documentController");
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post("/", verifyToken, authorizeRoles("admin", "lawyer"), uploadDocument);
router.get("/case/:caseId", verifyToken, authorizeRoles("admin", "lawyer", "client"), getDocumentsByCase);

module.exports = router;
