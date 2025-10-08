const User = require("../models/userModel");

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude passwords
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

module.exports = { getAllUsers };
