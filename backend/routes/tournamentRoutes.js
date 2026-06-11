// routes/tournamentRoutes.js
const express = require("express");
const router = express.Router();
const {
  createTournament, getAllTournaments, getTournamentById,
  updateTournament, deleteTournament,
} = require("../controllers/tournamentController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", getAllTournaments);                          // Public
router.get("/:id", getTournamentById);                      // Public
router.post("/", protect, adminOnly, createTournament);     // Admin only
router.put("/:id", protect, adminOnly, updateTournament);   // Admin only
router.delete("/:id", protect, adminOnly, deleteTournament); // Admin only

module.exports = router;
