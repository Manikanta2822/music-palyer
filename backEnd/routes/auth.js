const express = require("express");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../config/Jwt");
const User = require("../models/User");  // Ensure User is properly imported
const router = express.Router();

// Register User (Default role: "user")
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password, mobile } = req.body;

        let existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        let user = new User({ username, email, password: hashedPassword, mobile, role: "user" });
        await user.save();

        const token = generateToken(user._id);
        res.status(201).json({ message: "User registered successfully", token, role: user.role });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Register Admin with Static Details
router.post("/admin/signup", async (req, res) => {
    try {
        let existingAdmin = await User.findOne({ email: "admin@gmail.com" });
        if (existingAdmin) return res.status(400).json({ message: "Admin already exists" });

        const hashedPassword = await bcrypt.hash("admin123", 10);
        let admin = new User({  // Fixed variable name
            username: "admin",
            email: "admin@gmail.com",
            password: hashedPassword,
            mobile: "9014104128",
            role: "admin"
        });
        await admin.save();

        const token = generateToken(admin._id);
        res.status(201).json({ message: "Admin registered successfully", token, role: admin.role });
    } catch (error) {
        console.error("Admin signup error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Login Route (Common for User and Admin)
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = generateToken(user._id);
        res.json({ message: "Login successful", token, role: user.role });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
