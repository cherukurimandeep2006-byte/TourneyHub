// routes/scoreRoutes.js
const express = require("express");
const router = express.Router();
const { createScore, getScore, updateScore } = require("../controllers/scoreController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/:matchId", protect, adminOnly, createScore);
router.get("/:matchId", getScore);                       // Public
router.put("/:matchId", protect, adminOnly, updateScore);

module.exports = router;
