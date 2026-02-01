// routes/caseRoutes.js
const express = require("express");
const { createCase, getCases, getCaseById, updateCase, addRojnamaUpdate} = require("../controllers/caseController");
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const router = express.Router();

// CRUD routes
router.post("/", verifyToken, authorizeRoles("admin", "lawyer"), createCase);
router.get("/", verifyToken, authorizeRoles("admin", "lawyer", "client"), getCases);
router.get("/:id", verifyToken, authorizeRoles("admin", "lawyer", "client"), getCaseById);
router.patch("/:id", verifyToken, authorizeRoles("admin", "lawyer"), updateCase);
router.patch("/:id/rojnama", verifyToken, authorizeRoles("admin", "lawyer"), addRojnamaUpdate);

module.exports = router;
