// controllers/caseController.js
const Case = require("../models/caseModel");
const User = require("../models/userModel");

// Create a new case (admin/lawyer)
const createCase = async (req, res) => {
  try {
    const { title, description, client, lawyers, priority } = req.body;

    if (!title || !client) {
      return res.status(400).json({ message: "Title and client are required" });
    }

    // Optional: check client exists
    const clientExists = await User.findById(client);
    if (!clientExists || clientExists.role !== "client") {
      return res.status(400).json({ message: "Invalid client ID" });
    }

    // Optional: check lawyers
    if (lawyers && lawyers.length > 0) {
      const validLawyers = await User.find({ _id: { $in: lawyers }, role: "lawyer" });
      if (validLawyers.length !== lawyers.length) {
        return res.status(400).json({ message: "One or more lawyer IDs are invalid" });
      }
    }

    const newCase = await Case.create({
      title,
      description,
      client,
      lawyers,
      priority,
    });

    res.status(201).json(newCase);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating case" });
  }
};

// Get all cases (role-based)
const getCases = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "client") query.client = req.user.id;
    if (req.user.role === "lawyer") query.lawyers = req.user.id;

    const cases = await Case.find(query)
      .populate("client", "username")
      .populate("lawyers", "username");

    res.json(cases);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching cases" });
  }
};

// Get single case by ID
const getCaseById = async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.id)
      .populate("client", "username")
      .populate("lawyers", "username");

    if (!caseData) return res.status(404).json({ message: "Case not found" });

    if (req.user.role === "client" && caseData.client._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }
    if (req.user.role === "lawyer" && !caseData.lawyers.some(l => l._id.toString() === req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(caseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching case" });
  }
};

// Update case (admin/lawyer)
const updateCase = async (req, res) => {
  try {
    const updatedCase = await Case.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCase);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating case" });
  }
};

// Add a log entry to the Rojnama array
const addRojnamaUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { updateText } = req.body; // component only sends updateText

    const updatedCase = await Case.findByIdAndUpdate(
      id,
      { 
        $push: { 
          rojnama: { 
            update: updateText, 
            addedBy: req.user.username, // Use the username from the JWT token!
            date: new Date() 
          } 
        } 
      },
      { new: true }
    )
    .populate("client", "username") // Re-populate so UI doesn't break
    .populate("lawyers", "username");

    res.json(updatedCase);
  } catch (err) {
    res.status(500).json({ message: "Error adding update" });
  }
};

module.exports = { 
  createCase, 
  getCases, 
  getCaseById, 
  updateCase, 
  addRojnamaUpdate 
};