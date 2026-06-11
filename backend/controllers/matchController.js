// ============================================
// controllers/matchController.js
// ============================================

const Match = require("../models/Match");
const Team = require("../models/Team");
const Tournament = require("../models/Tournament");

// ---- @route   POST /api/matches/generate-fixtures/:tournamentId ----
// @desc    Admin generates match fixtures from approved teams
// @access  Private/Admin
const generateFixtures = async (req, res) => {
  try {
    const { tournamentId } = req.params;

    // Check if fixtures already exist for this tournament
    const existingMatches = await Match.find({ tournament: tournamentId });
    if (existingMatches.length > 0) {
      return res.status(400).json({ message: "Fixtures already generated for this tournament" });
    }

    // Get only approved teams for this tournament
    const approvedTeams = await Team.find({
      tournament: tournamentId,
      registrationStatus: "approved",
    });

    if (approvedTeams.length < 2) {
      return res.status(400).json({ message: "At least 2 approved teams are required to generate fixtures" });
    }

    const matches = [];
    let round = 1;

    // Knockout fixture generation: pair teams sequentially
    // If odd number of teams, last team gets a BYE
    for (let i = 0; i < approvedTeams.length; i += 2) {
      if (i + 1 < approvedTeams.length) {
        // Normal match between two teams
        matches.push({
          tournament: tournamentId,
          teamA: approvedTeams[i]._id,
          teamB: approvedTeams[i + 1]._id,
          round: `Round ${round}`,
          status: "scheduled",
          isBye: false,
        });
      } else {
        // Odd team out: gets a BYE (moves directly to next round)
        matches.push({
          tournament: tournamentId,
          teamA: approvedTeams[i]._id,
          teamB: null,
          round: `Round ${round}`,
          status: "completed",
          winner: approvedTeams[i]._id, // Team with BYE wins automatically
          isBye: true,
        });
      }
      round++;
    }

    // Save all matches to database
    const createdMatches = await Match.insertMany(matches);

    // Update tournament status to ongoing
    await Tournament.findByIdAndUpdate(tournamentId, { status: "ongoing" });

    res.status(201).json({ message: "Fixtures generated successfully", matches: createdMatches });
  } catch (error) {
    console.error("Generate Fixtures Error:", error.message);
    res.status(500).json({ message: "Server error generating fixtures" });
  }
};

// ---- @route   GET /api/matches/tournament/:tournamentId ----
// @desc    Get all matches for a tournament (public)
// @access  Public
const getMatchesByTournament = async (req, res) => {
  try {
    const matches = await Match.find({ tournament: req.params.tournamentId })
      .populate("teamA", "teamName")
      .populate("teamB", "teamName")
      .populate("winner", "teamName")
      .sort({ createdAt: 1 }); // Oldest first = Round 1 first
    res.json(matches);
  } catch (error) {
    console.error("Get Matches Error:", error.message);
    res.status(500).json({ message: "Server error fetching matches" });
  }
};

// ---- @route   GET /api/matches/:id ----
// @desc    Get a single match by ID
// @access  Public
const getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate("teamA", "teamName players")
      .populate("teamB", "teamName players")
      .populate("winner", "teamName")
      .populate("tournament", "tournamentName venue");
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }
    res.json(match);
  } catch (error) {
    console.error("Get Match Error:", error.message);
    res.status(500).json({ message: "Server error fetching match" });
  }
};

// ---- @route   PUT /api/matches/:id/result ----
// @desc    Admin updates match result and declares winner
// @access  Private/Admin
const updateMatchResult = async (req, res) => {
  try {
    const { winner, teamAScore, teamBScore, winType, winMargin, playerOfTheMatch, matchDate, matchTime, venue } = req.body;
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    // Update result fields
    if (winner) match.winner = winner;
    if (teamAScore !== undefined) match.teamAScore = teamAScore;
    if (teamBScore !== undefined) match.teamBScore = teamBScore;
    if (winType) match.winType = winType;
    if (winMargin) match.winMargin = winMargin;
    if (playerOfTheMatch) match.playerOfTheMatch = playerOfTheMatch;
    if (matchDate) match.matchDate = matchDate;
    if (matchTime) match.matchTime = matchTime;
    if (venue) match.venue = venue;
    match.status = "completed";

    await match.save();
    res.json({ message: "Match result updated", match });
  } catch (error) {
    console.error("Update Result Error:", error.message);
    res.status(500).json({ message: "Server error updating result" });
  }
};

// ---- @route   PUT /api/matches/:id/schedule ----
// @desc    Admin updates match schedule (date, time, venue)
// @access  Private/Admin
const scheduleMatch = async (req, res) => {
  try {
    const { matchDate, matchTime, venue } = req.body;
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ message: "Match not found" });

    if (matchDate) match.matchDate = matchDate;
    if (matchTime) match.matchTime = matchTime;
    if (venue) match.venue = venue;
    await match.save();
    res.json({ message: "Match scheduled", match });
  } catch (error) {
    res.status(500).json({ message: "Server error scheduling match" });
  }
};

// ---- @route   GET /api/matches/points-table/:tournamentId ----
// @desc    Calculate and return points table for a tournament
// @access  Public
const getPointsTable = async (req, res) => {
  try {
    const { tournamentId } = req.params;

    // Get all approved teams for this tournament
    const teams = await Team.find({
      tournament: tournamentId,
      registrationStatus: "approved",
    }).select("teamName");

    // Get all completed non-BYE matches
    const matches = await Match.find({
      tournament: tournamentId,
      status: "completed",
      isBye: false,
    });

    // Build points table: a map of teamId => stats
    const pointsMap = {};

    teams.forEach((team) => {
      pointsMap[team._id.toString()] = {
        team: { _id: team._id, teamName: team.teamName },
        matchesPlayed: 0,
        won: 0,
        lost: 0,
        tied: 0,
        points: 0,
      };
    });

    // Process each completed match
    matches.forEach((match) => {
      const teamAId = match.teamA?.toString();
      const teamBId = match.teamB?.toString();
      const winnerId = match.winner?.toString();

      // Ensure both teams are in the map
      if (!teamAId || !teamBId) return;
      if (!pointsMap[teamAId] || !pointsMap[teamBId]) return;

      // Increment matches played for both teams
      pointsMap[teamAId].matchesPlayed += 1;
      pointsMap[teamBId].matchesPlayed += 1;

      if (winnerId === teamAId) {
        // Team A wins: +2 points, +1 win; Team B: +1 loss
        pointsMap[teamAId].won += 1;
        pointsMap[teamAId].points += 2;
        pointsMap[teamBId].lost += 1;
      } else if (winnerId === teamBId) {
        // Team B wins
        pointsMap[teamBId].won += 1;
        pointsMap[teamBId].points += 2;
        pointsMap[teamAId].lost += 1;
      } else {
        // Tie: both get 1 point
        pointsMap[teamAId].tied += 1;
        pointsMap[teamAId].points += 1;
        pointsMap[teamBId].tied += 1;
        pointsMap[teamBId].points += 1;
      }
    });

    // Convert map to array and sort by points descending
    const table = Object.values(pointsMap).sort((a, b) => b.points - a.points);

    res.json(table);
  } catch (error) {
    console.error("Points Table Error:", error.message);
    res.status(500).json({ message: "Server error calculating points table" });
  }
};

module.exports = {
  generateFixtures, getMatchesByTournament, getMatchById,
  updateMatchResult, scheduleMatch, getPointsTable,
};
