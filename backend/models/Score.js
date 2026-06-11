// ============================================
// models/Score.js - Live Score Schema (Cricket)
// ============================================

const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema(
  {
    // Which match this score belongs to
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true,
    },
    battingTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    bowlingTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    runs: {
      type: Number,
      default: 0,
    },
    wickets: {
      type: Number,
      default: 0,
    },
    // Total complete overs
    overs: {
      type: Number,
      default: 0,
    },
    // Balls in current over (0-5)
    balls: {
      type: Number,
      default: 0,
    },
    extras: {
      type: Number,
      default: 0,
    },
    // Target runs (for second innings)
    target: {
      type: Number,
      default: 0,
    },
    // 1 = first innings, 2 = second innings
    innings: {
      type: Number,
      default: 1,
    },
    currentBatsman: {
      type: String,
      default: "",
    },
    currentBowler: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Score", scoreSchema);
