const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body; // Added email
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, email, password: hashedPassword, role });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ message: "Registration failed. Email or Username might already exist." });
    }
};

const login = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user exists with BOTH matching username and email
    const user = await User.findOne({ username, email });

    if (!user) {
      return res.status(401).json({ message: "Invalid firm credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
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