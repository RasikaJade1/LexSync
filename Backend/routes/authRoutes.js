const express = require("express");
const router = express.Router();

// Double check if it is authController or authcontroller
const { register, login } = require("../controllers/authcontroller"); 

// Ensure these paths match your folder names exactly
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

// Public Route
router.post("/login", login);

// Protected Route
router.post("/register", verifyToken, authorizeRoles("admin"), register);

module.exports = router;