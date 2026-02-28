// routes/appointmentRoutes.js
const express = require("express");
const { createAppointment, getAppointments, deleteAppointment } = require("../controllers/appointmentController");
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const router = express.Router();

// Fetch appointments (Everyone can view their own)
router.get("/", verifyToken, getAppointments);

// Create and Delete (Admins and Lawyers only)
router.post("/", verifyToken, authorizeRoles("admin", "lawyer"), createAppointment);
router.delete("/:id", verifyToken, authorizeRoles("admin", "lawyer"), deleteAppointment);

module.exports = router;