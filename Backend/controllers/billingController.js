const Billing = require("../models/billingModel");
const Case = require("../models/caseModel");
const User = require("../models/userModel");

// Create billing (quotation/invoice)
const createBilling = async (req, res) => {
  try {
    const { case: caseId, client, quotationAmount, invoiceAmount, status, description } = req.body;

    if (!caseId || !client) {
      return res.status(400).json({ message: "Case and client are required" });
    }

    const caseExists = await Case.findById(caseId);
    if (!caseExists) return res.status(400).json({ message: "Case does not exist" });

    const clientExists = await User.findById(client);
    if (!clientExists || clientExists.role !== "client") {
      return res.status(400).json({ message: "Invalid client ID" });
    }

    const newBilling = await Billing.create({
      case: caseId,
      client,
      createdBy: req.user.id,
      quotationAmount,
      invoiceAmount,
      status: status || "quotation",
      description,
    });

    const populatedBilling = await Billing.findById(newBilling._id)
      .populate("case", "title")
      .populate("client", "firstName lastName username")
      .populate("createdBy", "username firstName lastName");

    res.status(201).json(populatedBilling);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating billing record" });
  }
};

// Get all billing records (role-based)
const getBillings = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "client") {
      query.client = req.user.id;
    } else if (req.user.role === "lawyer") {
      // Lawyers can see billing for cases they're assigned to
      const lawyerCases = await Case.find({ lawyers: req.user.id }).select("_id");
      query.case = { $in: lawyerCases.map(c => c._id) };
    }
    // Admins see all billing records — no filter applied

    const billings = await Billing.find(query)
      .populate("case", "title")
      .populate("client", "firstName lastName username")
      .populate("createdBy", "username firstName lastName")
      .sort({ createdAt: -1 });

    res.json(billings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching billing records" });
  }
};

// Update billing status
const updateBilling = async (req, res) => {
  try {
    const updatedBilling = await Billing.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("case", "title")
      .populate("client", "firstName lastName username")
      .populate("createdBy", "username firstName lastName");
    
    if (!updatedBilling) return res.status(404).json({ message: "Billing record not found" });
    
    res.json(updatedBilling);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating billing record" });
  }
};

// Delete billing record
const deleteBilling = async (req, res) => {
  try {
    const deletedBilling = await Billing.findByIdAndDelete(req.params.id);
    if (!deletedBilling) return res.status(404).json({ message: "Billing record not found" });
    
    res.json({ message: "Billing record deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting billing record" });
  }
};

module.exports = { 
  createBilling, 
  getBillings, 
  updateBilling, 
  deleteBilling 
};
