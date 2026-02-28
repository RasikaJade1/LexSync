const Case = require("../models/caseModel");
const User = require("../models/userModel");

// Create a new case (admin/lawyer)
const createCase = async (req, res) => {
  try {
    const { title, description, client, lawyers, priority } = req.body;

    if (!title || !client) {
      return res.status(400).json({ message: "Title and client are required" });
    }

    const clientExists = await User.findById(client);
    if (!clientExists || clientExists.role !== "client") {
      return res.status(400).json({ message: "Invalid client ID" });
    }

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

    // Only filter for clients and lawyers; Admins get everything (query stays {})
    if (req.user.role === "client") {
      query.client = req.user.id;
    } else if (req.user.role === "lawyer") {
      query.lawyers = req.user.id;
    } 

    const cases = await Case.find(query)
      .populate("client", "username firstName lastName") 
      .populate("lawyers", "username firstName lastName")
      .sort({ createdAt: -1 }); // Show newest cases first

    console.log(`Found ${cases.length} cases for ${req.user.role} ID: ${req.user.id}`);
    res.json(cases);
  } catch (err) {
    console.error("Error fetching cases:", err);
    res.status(500).json({ message: "Error fetching cases" });
  }
};

const getCaseById = async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.id)
      .populate("client", "username firstName lastName")
      .populate("lawyers", "username firstName lastName");

    if (!caseData) return res.status(404).json({ message: "Case not found" });

    // Admin bypasses checks
    if (req.user.role !== "admin") {
        if (req.user.role === "client" && caseData.client._id.toString() !== req.user.id) {
          return res.status(403).json({ message: "Access denied" });
        }
        if (req.user.role === "lawyer" && !caseData.lawyers.some(l => l._id.toString() === req.user.id)) {
          return res.status(403).json({ message: "Access denied" });
        }
    }

    res.json(caseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching case" });
  }
};

const updateCase = async (req, res) => {
  try {
    const updatedCase = await Case.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("client", "username firstName lastName")
      .populate("lawyers", "username firstName lastName");
    res.json(updatedCase);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating case" });
  }
};

const addRojnamaUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { updateText } = req.body; 

    const updatedCase = await Case.findByIdAndUpdate(
      id,
      { 
        $push: { 
          rojnama: { 
            update: updateText, 
            addedBy: req.user.username || "Staff", 
            date: new Date() 
          } 
        } 
      },
      { new: true }
    )
    .populate("client", "username firstName lastName")
    .populate("lawyers", "username firstName lastName");

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