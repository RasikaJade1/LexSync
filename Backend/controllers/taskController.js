// controllers/taskController.js
const Task = require("../models/taskModel");
const User = require("../models/userModel");
const Case = require("../models/caseModel");

// Create Task
const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, caseId, priority, deadline } = req.body;

    if (!title || !assignedTo) return res.status(400).json({ message: "Title and assignee required" });

    const userExists = await User.findById(assignedTo);
    if (!userExists) return res.status(400).json({ message: "Assigned user does not exist" });

    if (caseId) {
      const caseExists = await Case.findById(caseId);
      if (!caseExists) return res.status(400).json({ message: "Linked case does not exist" });
    }

    const newTask = await Task.create({
      title,
      description,
      assignedTo,
      case: caseId,
      priority,
      deadline,
    });

    res.status(201).json(newTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating task" });
  }
};

// Get tasks (role-based)
const getTasks = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "lawyer") {
      // Lawyers see only their assigned tasks
      query.assignedTo = req.user.id;
    } else if (req.user.role === "client") {
      // Clients currently see none (you can later show case-related tasks)
      query.case = { $exists: false };
    } 
    // Admins see all tasks — no filter applied

    const tasks = await Task.find(query)
      .populate("assignedTo", "username")
      .populate("case", "title");

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching tasks" });
  }
};


// Update task
const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating task" });
  }
};

module.exports = { createTask, getTasks, updateTask };
