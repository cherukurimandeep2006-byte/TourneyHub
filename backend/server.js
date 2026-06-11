// ============================================
// server.js - Main Entry Point for TourneyHub
// ============================================

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// ---- Middleware ----
app.use(cors()); // Allow cross-origin requests from frontend
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Serve uploaded files as static files (payment screenshots, etc.)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---- API Routes ----
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tournaments", require("./routes/tournamentRoutes"));
app.use("/api/teams", require("./routes/teamRoutes"));
app.use("/api/matches", require("./routes/matchRoutes"));
app.use("/api/scores", require("./routes/scoreRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/complaints", require("./routes/complaintRoutes"));

// ---- Default Route ----
app.get("/", (req, res) => {
  res.json({ message: "TourneyHub API is running!" });
});

// ---- Start Server ----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ TourneyHub server running on port ${PORT}`);
});
