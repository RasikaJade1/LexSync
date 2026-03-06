const express = require("express");
const {
  createBilling,
  getBillings,
  updateBilling,
  deleteBilling,
} = require("../controllers/billingController");
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const router = express.Router();

// Create new billing record (admin/lawyer)
router.post("/", verifyToken, authorizeRoles("admin", "lawyer"), createBilling);

// Get all billing records (admin can see all, lawyer/client see related ones)
router.get("/", verifyToken, authorizeRoles("admin", "lawyer", "client"), getBillings);

// Update billing record (only admin/lawyer)
router.patch("/:id", verifyToken, authorizeRoles("admin", "lawyer"), updateBilling);

// Delete billing record (only admin)
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteBilling);

module.exports = router;
