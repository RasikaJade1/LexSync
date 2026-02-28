const Appointment = require("../models/appointmentModel");
const Case = require("../models/caseModel");
const User = require("../models/userModel");

// Create a New Appointment
const createAppointment = async (req, res) => {
  try {
    // 1:1 parameter mapping from the frontend payload to your schema
    const { title, type, date, time, duration, location, caseId, attendees, description, status } = req.body;

    // Strict validation
    if (!title || !date) {
      return res.status(400).json({ message: "Title and Date are required" });
    }

    const newAppointment = await Appointment.create({
      title, 
      type, 
      date, 
      time, 
      duration, 
      location, 
      caseId, 
      attendees, // Array of ObjectIDs
      description, 
      status
    });

    res.status(201).json(newAppointment);
  } catch (err) {
    console.error("Error creating appointment:", err);
    res.status(500).json({ message: "Error scheduling appointment" });
  }
};

// Get All Appointments (Role-based & Populated)
const getAppointments = async (req, res) => {
  try {
    let query = {};
    
    // Clients only see appointments they are explicitly invited to
    if (req.user.role === "client") {
      query.attendees = req.user.id;
    }

    const appointments = await Appointment.find(query)
      .populate("caseId", "title") // Replaces Case ID with the Case Title
      .populate("attendees", "firstName lastName username") // Replaces User ID with Names
      .sort({ date: 1, time: 1 }); // Sorts by date and time

    res.json(appointments);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ message: "Error fetching appointments" });
  }
};

// Delete Appointment
const deleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: "Appointment cancelled" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting appointment" });
  }
};


module.exports = { createAppointment, getAppointments, deleteAppointment };