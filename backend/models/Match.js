// ============================================
// models/Match.js - Match Schema
// ============================================

const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    // Which tournament this match belongs to
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    },
    teamA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    teamB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    // BYE: if teamB is null, teamA gets a walkover
    isBye: {
      type: Boolean,
      default: false,
    },
    matchDate: {
      type: Date,
    },
    matchTime: {
      type: String,
      trim: true,
    },
    venue: {
      type: String,
      trim: true,
    },
    round: {
      type: String,
      trim: true,
      default: "Round 1",
    },
    // Match status flow
    status: {
      type: String,
      enum: ["scheduled", "live", "completed", "cancelled"],
      default: "scheduled",
    },
    // Winner team reference (set when match is completed)
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    // Score summary
    teamAScore: {
      type: String,
      default: "",
    },
    teamBScore: {
      type: String,
      default: "",
    },
    // Win type: "runs", "wickets", "tie", "bye"
    winType: {
      type: String,
      default: "",
    },
    winMargin: {
      type: String,
      default: "",
    },
    playerOfTheMatch: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Match", matchSchema);
