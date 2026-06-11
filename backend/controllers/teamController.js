// ============================================
// controllers/teamController.js
// ============================================

const Team = require("../models/Team");
const Tournament = require("../models/Tournament");

// ---- @route   POST /api/teams/register ----
// @desc    Captain registers a team for a tournament
// @access  Private/Captain
const registerTeam = async (req, res) => {
  try {
    const { teamName, tournament, players } = req.body;

    if (!teamName || !tournament) {
      return res.status(400).json({ message: "Team name and tournament are required" });
    }

    // Check tournament exists
    const tournamentExists = await Tournament.findById(tournament);
    if (!tournamentExists) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    // Check if captain already registered a team for this tournament
    const alreadyRegistered = await Team.findOne({ captain: req.user._id, tournament });
    if (alreadyRegistered) {
      return res.status(400).json({ message: "You have already registered a team for this tournament" });
    }

    const team = await Team.create({
      teamName,
      captain: req.user._id,
      tournament,
      players: players || [],
    });

    res.status(201).json(team);
  } catch (error) {
    console.error("Register Team Error:", error.message);
    res.status(500).json({ message: "Server error registering team" });
  }
};

// ---- @route   GET /api/teams/tournament/:tournamentId ----
// @desc    Get all teams for a tournament (public)
// @access  Public
const getTeamsByTournament = async (req, res) => {
  try {
    const teams = await Team.find({ tournament: req.params.tournamentId })
      .populate("captain", "name email phone")
      .populate("tournament", "tournamentName");
    res.json(teams);
  } catch (error) {
    console.error("Get Teams Error:", error.message);
    res.status(500).json({ message: "Server error fetching teams" });
  }
};

// ---- @route   GET /api/teams/my-teams ----
// @desc    Get all teams registered by the logged-in captain
// @access  Private/Captain
const getMyTeams = async (req, res) => {
  try {
    const teams = await Team.find({ captain: req.user._id })
      .populate("tournament", "tournamentName status startDate");
    res.json(teams);
  } catch (error) {
    console.error("Get My Teams Error:", error.message);
    res.status(500).json({ message: "Server error fetching your teams" });
  }
};

// ---- @route   GET /api/teams/:id ----
// @desc    Get a single team by ID
// @access  Public
const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate("captain", "name email phone")
      .populate("tournament", "tournamentName status");
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    res.json(team);
  } catch (error) {
    console.error("Get Team Error:", error.message);
    res.status(500).json({ message: "Server error fetching team" });
  }
};

// ---- @route   PUT /api/teams/:id/approve ----
// @desc    Admin approves a team registration
// @access  Private/Admin
const approveTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    team.registrationStatus = "approved";
    await team.save();
    res.json({ message: "Team approved successfully", team });
  } catch (error) {
    console.error("Approve Team Error:", error.message);
    res.status(500).json({ message: "Server error approving team" });
  }
};

// ---- @route   PUT /api/teams/:id/reject ----
// @desc    Admin rejects a team registration
// @access  Private/Admin
const rejectTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    team.registrationStatus = "rejected";
    await team.save();
    res.json({ message: "Team rejected", team });
  } catch (error) {
    console.error("Reject Team Error:", error.message);
    res.status(500).json({ message: "Server error rejecting team" });
  }
};

// ---- @route   PUT /api/teams/:id/players ----
// @desc    Captain updates players in their team
// @access  Private/Captain
const updatePlayers = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Only the captain of this team can update
    if (team.captain.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this team" });
    }

    team.players = req.body.players || [];
    await team.save();
    res.json({ message: "Players updated successfully", team });
  } catch (error) {
    console.error("Update Players Error:", error.message);
    res.status(500).json({ message: "Server error updating players" });
  }
};

module.exports = {
  registerTeam, getTeamsByTournament, getMyTeams, getTeamById,
  approveTeam, rejectTeam, updatePlayers,
};
