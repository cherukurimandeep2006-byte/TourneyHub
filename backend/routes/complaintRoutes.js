// routes/complaintRoutes.js
const express = require("express");
const router = express.Router();
const {
  createComplaint, getComplaintsByTournament, getAllComplaints, replyToComplaint,
} = require("../controllers/complaintController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", protect, createComplaint);
router.get("/all", protect, adminOnly, getAllComplaints);
router.get("/tournament/:tournamentId", protect, getComplaintsByTournament);
router.put("/:id/reply", protect, adminOnly, replyToComplaint);

module.exports = router;
