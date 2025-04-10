const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verifyAdmin = require("../Middleware/VerifyAdmin");

// GET non-admin users (admin only)
router.get("/users", verifyAdmin, async (req, res) => {
  try {
    const nonAdminUsers = await User.find({ role: { $ne: "admin" } }).select("-password");
    res.status(200).json(nonAdminUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
