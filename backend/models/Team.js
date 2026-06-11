// ============================================
// models/Team.js - Team Schema
// ============================================

const mongoose = require("mongoose");

// Sub-schema for each player inside a team
const playerSchema = new mongoose.Schema({
  playerName: {
    type: String,
    required: [true, "Player name is required"],
    trim: true,
  },
  age: {
    type: Number,
  },
  phone: {
    type: String,
    trim: true,
  },
  // Player role in the sport (e.g., Batsman, Bowler)
  role: {
    type: String,
    enum: ["Batsman", "Bowler", "All-rounder", "Wicket Keeper", "Other"],
    default: "Other",
  },
  battingStyle: {
    type: String,
    enum: ["Right Hand", "Left Hand", ""],
    default: "",
  },
  bowlingStyle: {
    type: String,
    enum: ["Right Arm Fast", "Right Arm Spin", "Left Arm Fast", "Left Arm Spin", ""],
    default: "",
  },
  jerseyNumber: {
    type: Number,
  },
});

const teamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: [true, "Team name is required"],
      trim: true,
    },
    // Reference to captain (User)
    captain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Reference to the tournament this team is registered for
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    },
    // Array of players
    players: [playerSchema],
    // Admin approves or rejects registration
    registrationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    // Payment status
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "verified", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Team", teamSchema);
