// routes/matchRoutes.js
const express = require("express");
const router = express.Router();
const {
  generateFixtures, getMatchesByTournament, getMatchById,
  updateMatchResult, scheduleMatch, getPointsTable,
} = require("../controllers/matchController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/generate-fixtures/:tournamentId", protect, adminOnly, generateFixtures);
router.get("/tournament/:tournamentId", getMatchesByTournament);          // Public
router.get("/points-table/:tournamentId", getPointsTable);                // Public
router.get("/:id", getMatchById);                                          // Public
router.put("/:id/result", protect, adminOnly, updateMatchResult);
router.put("/:id/schedule", protect, adminOnly, scheduleMatch);

module.exports = router;
