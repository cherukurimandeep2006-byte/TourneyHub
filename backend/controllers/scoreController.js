// ============================================
// controllers/scoreController.js - Live Score Logic
// ============================================

const Score = require("../models/Score");
const Match = require("../models/Match");

// ---- @route   POST /api/scores/:matchId ----
// @desc    Admin creates a score entry for a match (start scoring)
// @access  Private/Admin
const createScore = async (req, res) => {
  try {
    const { matchId } = req.params;

    // Check if score already exists for this match & innings
    const existingScore = await Score.findOne({ match: matchId, innings: req.body.innings || 1 });
    if (existingScore) {
      return res.status(400).json({ message: "Score entry already exists for this innings" });
    }

    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ message: "Match not found" });

    // Update match status to live
    match.status = "live";
    await match.save();

    const score = await Score.create({
      match: matchId,
      battingTeam: req.body.battingTeam,
      bowlingTeam: req.body.bowlingTeam,
      innings: req.body.innings || 1,
      target: req.body.target || 0,
    });

    res.status(201).json(score);
  } catch (error) {
    console.error("Create Score Error:", error.message);
    res.status(500).json({ message: "Server error creating score" });
  }
};

// ---- @route   GET /api/scores/:matchId ----
// @desc    Get live score for a match (public)
// @access  Public
const getScore = async (req, res) => {
  try {
    const scores = await Score.find({ match: req.params.matchId })
      .populate("battingTeam", "teamName")
      .populate("bowlingTeam", "teamName")
      .sort({ innings: 1 });

    if (!scores || scores.length === 0) {
      return res.status(404).json({ message: "No score found for this match" });
    }
    res.json(scores);
  } catch (error) {
    console.error("Get Score Error:", error.message);
    res.status(500).json({ message: "Server error fetching score" });
  }
};

// ---- @route   PUT /api/scores/:matchId ----
// @desc    Admin updates live score (ball by ball or over)
// @access  Private/Admin
const updateScore = async (req, res) => {
  try {
    const { innings } = req.body;
    const score = await Score.findOne({ match: req.params.matchId, innings: innings || 1 });
    if (!score) {
      return res.status(404).json({ message: "Score not found for this innings" });
    }

    // Update provided fields
    const fields = [
      "runs", "wickets", "overs", "balls", "extras",
      "target", "currentBatsman", "currentBowler",
    ];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        score[field] = req.body[field];
      }
    });

    await score.save();
    res.json(score);
  } catch (error) {
    console.error("Update Score Error:", error.message);
    res.status(500).json({ message: "Server error updating score" });
  }
};

module.exports = { createScore, getScore, updateScore };
