// routes/teamRoutes.js
const express = require("express");
const router = express.Router();
const {
  registerTeam, getTeamsByTournament, getMyTeams, getTeamById,
  approveTeam, rejectTeam, updatePlayers,
} = require("../controllers/teamController");
const { protect, adminOnly, captainOnly } = require("../middleware/authMiddleware");

router.post("/register", protect, captainOnly, registerTeam);
router.get("/my-teams", protect, getMyTeams);
router.get("/tournament/:tournamentId", getTeamsByTournament);       // Public
router.get("/:id", getTeamById);                                     // Public
router.put("/:id/approve", protect, adminOnly, approveTeam);
router.put("/:id/reject", protect, adminOnly, rejectTeam);
router.put("/:id/players", protect, captainOnly, updatePlayers);

module.exports = router;
