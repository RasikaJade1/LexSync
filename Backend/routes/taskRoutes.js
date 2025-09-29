// routes/taskRoutes.js
const express = require("express");
const { createTask, getTasks, updateTask } = require("../controllers/taskController");
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post("/", verifyToken, authorizeRoles("admin", "lawyer"), createTask);
router.get("/", verifyToken, authorizeRoles("admin", "lawyer", "client"), getTasks);
router.patch("/:id", verifyToken, authorizeRoles("admin", "lawyer"), updateTask);

module.exports = router;
