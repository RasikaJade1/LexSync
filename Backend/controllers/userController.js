const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude passwords
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// Get Current User Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update Profile (Personal & Professional)
const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    // Prevent password updates through this route
    delete updates.password; 

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Update failed", error });
  }
};

// Update Password (Security Tab)
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Security update failed" });
  }
};

module.exports = { getAllUsers, getProfile, updateProfile, updatePassword };
