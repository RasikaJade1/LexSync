const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// controllers/authController.js
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: "Username or Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Spread req.body to include firstName, lastName, phone, etc.
        const newUser = new User({ 
            ...req.body, 
            password: hashedPassword 
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        // This is crucial: it prints the Mongoose validation error to your terminal
        console.error("Registration Error:", err); 
        res.status(400).json({ message: err.message || "Registration failed" });
    }
};

const login = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user exists with BOTH matching username and email
    const user = await User.findOne({ username, email });

    if (!user) {
      console.log("User not found with this username and email combination");
      return res.status(401).json({ message: "Invalid firm credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password does not match for user:", username); // Debug
      return res.status(401).json({ message: "Invalid firm credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" } // Longer session for a workday
    );

    res.status(200).json({ token, username: user.username, role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
    register,
    login
};