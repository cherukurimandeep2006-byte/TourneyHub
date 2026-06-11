// ============================================
// controllers/tournamentController.js
// ============================================

const Tournament = require("../models/Tournament");

// ---- @route   POST /api/tournaments ----
// @desc    Admin creates a new tournament
// @access  Private/Admin
const createTournament = async (req, res) => {
  try {
    const {
      tournamentName, sportType, venue, startDate, endDate,
      entryFee, maxTeams, rules, prizeMoney,
      organizerName, organizerPhone, upiId, status,
    } = req.body;

    if (!tournamentName || !sportType || !venue || !startDate || !endDate || !maxTeams) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const tournament = await Tournament.create({
      tournamentName, sportType, venue, startDate, endDate,
      entryFee: entryFee || 0, maxTeams, rules, prizeMoney: prizeMoney || 0,
      organizerName, organizerPhone, upiId,
      status: status || "upcoming",
      createdBy: req.user._id,
    });

    res.status(201).json(tournament);
  } catch (error) {
    console.error("Create Tournament Error:", error.message);
    res.status(500).json({ message: "Server error creating tournament" });
  }
};

// ---- @route   GET /api/tournaments ----
// @desc    Get all tournaments (public)
// @access  Public
const getAllTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 }); // Newest first
    res.json(tournaments);
  } catch (error) {
    console.error("Get Tournaments Error:", error.message);
    res.status(500).json({ message: "Server error fetching tournaments" });
  }
};

// ---- @route   GET /api/tournaments/:id ----
// @desc    Get a single tournament by ID (public)
// @access  Public
const getTournamentById = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id).populate("createdBy", "name email");
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }
    res.json(tournament);
  } catch (error) {
    console.error("Get Tournament Error:", error.message);
    res.status(500).json({ message: "Server error fetching tournament" });
  }
};

// ---- @route   PUT /api/tournaments/:id ----
// @desc    Admin updates a tournament
// @access  Private/Admin
const updateTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    // Update fields that are provided in request body
    const fields = [
      "tournamentName", "sportType", "venue", "startDate", "endDate",
      "entryFee", "maxTeams", "rules", "prizeMoney",
      "organizerName", "organizerPhone", "upiId", "status",
    ];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        tournament[field] = req.body[field];
      }
    });

    const updated = await tournament.save();
    res.json(updated);
  } catch (error) {
    console.error("Update Tournament Error:", error.message);
    res.status(500).json({ message: "Server error updating tournament" });
  }
};

// ---- @route   DELETE /api/tournaments/:id ----
// @desc    Admin deletes a tournament
// @access  Private/Admin
const deleteTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }
    await tournament.deleteOne();
    res.json({ message: "Tournament deleted successfully" });
  } catch (error) {
    console.error("Delete Tournament Error:", error.message);
    res.status(500).json({ message: "Server error deleting tournament" });
  }
};

module.exports = {
  createTournament, getAllTournaments, getTournamentById,
  updateTournament, deleteTournament,
};
