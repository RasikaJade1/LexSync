const express = require("express");
const {
  createBilling,
  getBillings,
  getBillingById,
  updateBilling,
} = require("../controllers/billingController");
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const router = express.Router();

// Create new billing record (admin/lawyer)
router.post("/", verifyToken, authorizeRoles("admin", "lawyer"), createBilling);

// Get all billing records (admin can see all, lawyer/client see related ones)
router.get("/", verifyToken, authorizeRoles("admin", "lawyer", "client"), getBillings);

// Get single billing record by ID
router.get("/:id", verifyToken, authorizeRoles("admin", "lawyer", "client"), getBillingById);

// Update billing record (only admin/lawyer)
router.patch("/:id", verifyToken, authorizeRoles("admin", "lawyer"), updateBilling);

module.exports = router;
