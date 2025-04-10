const User = require("../models/User");
const { verifyToken } = require("../config/Jwt");

const verifyAdmin = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Access Denied: No Token Provided" });
  }

  try {
    const decoded = verifyToken(token.replace("Bearer ", ""));

    // Fetch user from DB
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    req.user = user; // Attach full user data to request
    next();
  } catch (err) {
    console.error("Admin verification failed:", err.message);
    res.status(403).json({ message: "Invalid or Expired Token" });
  }
};

module.exports = verifyAdmin;
