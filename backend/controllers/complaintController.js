// ============================================
// controllers/complaintController.js
// ============================================

const Complaint = require("../models/Complaint");

// ---- @route   POST /api/complaints ----
// @desc    User raises a complaint
// @access  Private
const createComplaint = async (req, res) => {
  try {
    const { tournament, subject, description } = req.body;

    if (!tournament || !subject || !description) {
      return res.status(400).json({ message: "Tournament, subject, and description are required" });
    }

    const complaint = await Complaint.create({
      user: req.user._id,
      tournament, subject, description,
    });

    res.status(201).json({ message: "Complaint submitted successfully", complaint });
  } catch (error) {
    console.error("Create Complaint Error:", error.message);
    res.status(500).json({ message: "Server error submitting complaint" });
  }
};

// ---- @route   GET /api/complaints/tournament/:tournamentId ----
// @desc    Get all complaints for a tournament
// @access  Private (admin sees all; user sees their own)
const getComplaintsByTournament = async (req, res) => {
  try {
    let query = { tournament: req.params.tournamentId };

    // If not admin, only show user's own complaints
    if (req.user.role !== "admin") {
      query.user = req.user._id;
    }

    const complaints = await Complaint.find(query)
      .populate("user", "name email")
      .populate("tournament", "tournamentName")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    console.error("Get Complaints Error:", error.message);
    res.status(500).json({ message: "Server error fetching complaints" });
  }
};

// ---- @route   GET /api/complaints/all ----
// @desc    Admin views all complaints
// @access  Private/Admin
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user", "name email")
      .populate("tournament", "tournamentName")
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching all complaints" });
  }
};

// ---- @route   PUT /api/complaints/:id/reply ----
// @desc    Admin replies to a complaint
// @access  Private/Admin
const replyToComplaint = async (req, res) => {
  try {
    const { adminReply, status } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    complaint.adminReply = adminReply || complaint.adminReply;
    complaint.status = status || "resolved";
    await complaint.save();

    res.json({ message: "Reply sent", complaint });
  } catch (error) {
    console.error("Reply Complaint Error:", error.message);
    res.status(500).json({ message: "Server error replying to complaint" });
  }
};

module.exports = { createComplaint, getComplaintsByTournament, getAllComplaints, replyToComplaint };
