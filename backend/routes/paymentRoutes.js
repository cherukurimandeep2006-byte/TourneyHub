// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const {
  uploadPayment, getPaymentsByTournament, getPaymentByTeam,
  verifyPayment, rejectPayment,
} = require("../controllers/paymentController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Captain uploads payment with screenshot image
router.post("/upload", protect, upload.single("screenshot"), uploadPayment);
router.get("/tournament/:tournamentId", protect, adminOnly, getPaymentsByTournament);
router.get("/team/:teamId", protect, getPaymentByTeam);
router.put("/:id/verify", protect, adminOnly, verifyPayment);
router.put("/:id/reject", protect, adminOnly, rejectPayment);

module.exports = router;
