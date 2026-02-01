const express = require("express");
const router = express.Router();
const { 
    getAllUsers, 
    getProfile, 
    updateProfile, 
    updatePassword 
} = require("../controllers/userController");
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

// --- PROFILE ROUTES (Accessible by any logged-in user) ---

// Get current logged-in user's profile data
router.get("/profile", verifyToken, getProfile);

// Update personal/professional details (excluding password)
router.patch("/profile", verifyToken, updateProfile);

// Securely update password (requires current password verification in controller)
router.patch("/profile/password", verifyToken, updatePassword);


// --- ROLE-SPECIFIC DASHBOARD ROUTES ---

// Only admin can get the list of all the users (client, lawyer, admin)
router.get("/", verifyToken, authorizeRoles("admin"), getAllUsers);

// Only admins can access this route
router.get("/admin", verifyToken, authorizeRoles("admin"), (req, res) => {
    res.json({ message: "Welcome Admin" });
});

// Both admin and lawyer can access this route
router.get("/lawyer", verifyToken, authorizeRoles("admin", "lawyer"), (req, res) => {
    res.json({ message: "Welcome Lawyer" });
});

// All roles (Admin, Lawyer, Client) can access this route 
// (Note: Added "lawyer" to authorizeRoles so they aren't blocked from client-level data)
router.get("/client", verifyToken, authorizeRoles("admin", "lawyer", "client"), (req, res) => {
    res.json({ message: "Welcome Client" });
});

module.exports = router;