// ============================================
// controllers/paymentController.js
// ============================================

const Payment = require("../models/Payment");
const Team = require("../models/Team");

// ---- @route   POST /api/payments/upload ----
// @desc    Captain uploads payment screenshot
// @access  Private/Captain
const uploadPayment = async (req, res) => {
  try {
    const { team, tournament, amount, transactionId } = req.body;

    if (!team || !tournament || !amount) {
      return res.status(400).json({ message: "Team, tournament, and amount are required" });
    }

    // Check if payment already uploaded for this team/tournament
    const existing = await Payment.findOne({ team, tournament });
    if (existing) {
      return res.status(400).json({ message: "Payment already submitted for this team" });
    }

    // Get screenshot filename if uploaded
    const screenshot = req.file ? req.file.filename : "";

    const payment = await Payment.create({
      team, tournament, amount, transactionId, screenshot,
    });

    // Update team's payment status to "paid"
    await Team.findByIdAndUpdate(team, { paymentStatus: "paid" });

    res.status(201).json({ message: "Payment uploaded successfully", payment });
  } catch (error) {
    console.error("Upload Payment Error:", error.message);
    res.status(500).json({ message: "Server error uploading payment" });
  }
};

// ---- @route   GET /api/payments/tournament/:tournamentId ----
// @desc    Admin views all payments for a tournament
// @access  Private/Admin
const getPaymentsByTournament = async (req, res) => {
  try {
    const payments = await Payment.find({ tournament: req.params.tournamentId })
      .populate("team", "teamName registrationStatus")
      .populate("tournament", "tournamentName entryFee");
    res.json(payments);
  } catch (error) {
    console.error("Get Payments Error:", error.message);
    res.status(500).json({ message: "Server error fetching payments" });
  }
};

// ---- @route   GET /api/payments/team/:teamId ----
// @desc    Captain views their team's payment
// @access  Private
const getPaymentByTeam = async (req, res) => {
  try {
    const payment = await Payment.findOne({ team: req.params.teamId })
      .populate("team", "teamName")
      .populate("tournament", "tournamentName");
    if (!payment) return res.status(404).json({ message: "No payment found for this team" });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching payment" });
  }
};

// ---- @route   PUT /api/payments/:id/verify ----
// @desc    Admin verifies a payment
// @access  Private/Admin
const verifyPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.status = "verified";
    payment.adminNote = req.body.adminNote || "";
    await payment.save();

    // Update team's payment status to "verified"
    await Team.findByIdAndUpdate(payment.team, { paymentStatus: "verified" });

    res.json({ message: "Payment verified", payment });
  } catch (error) {
    console.error("Verify Payment Error:", error.message);
    res.status(500).json({ message: "Server error verifying payment" });
  }
};

// ---- @route   PUT /api/payments/:id/reject ----
// @desc    Admin rejects a payment
// @access  Private/Admin
const rejectPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.status = "rejected";
    payment.adminNote = req.body.adminNote || "";
    await payment.save();

    // Update team's payment status to "rejected"
    await Team.findByIdAndUpdate(payment.team, { paymentStatus: "rejected" });

    res.json({ message: "Payment rejected", payment });
  } catch (error) {
    console.error("Reject Payment Error:", error.message);
    res.status(500).json({ message: "Server error rejecting payment" });
  }
};

module.exports = { uploadPayment, getPaymentsByTournament, getPaymentByTeam, verifyPayment, rejectPayment };
