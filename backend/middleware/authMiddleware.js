// ============================================
// middleware/authMiddleware.js - JWT Auth & Role Guard
// ============================================

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ---- Protect Middleware ----
// Verifies JWT token and attaches user to req.user
const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extract token from header: "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using JWT secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by decoded ID (exclude password from result)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next(); // Proceed to next middleware or route handler
    } catch (error) {
      console.error("JWT Error:", error.message);
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

// ---- Admin Only Middleware ----
// Must be used after protect middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};

// ---- Captain Only Middleware ----
const captainOnly = (req, res, next) => {
  if (req.user && (req.user.role === "captain" || req.user.role === "admin")) {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Captains only." });
  }
};

module.exports = { protect, adminOnly, captainOnly };
