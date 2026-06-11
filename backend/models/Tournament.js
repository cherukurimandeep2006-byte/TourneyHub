// ============================================
// models/Tournament.js - Tournament Schema
// ============================================

const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema(
  {
    tournamentName: {
      type: String,
      required: [true, "Tournament name is required"],
      trim: true,
    },
    sportType: {
      type: String,
      required: [true, "Sport type is required"],
      enum: ["Cricket", "Football", "Kabaddi", "Volleyball", "Badminton", "Chess", "Other"],
      default: "Cricket",
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    entryFee: {
      type: Number,
      default: 0,
    },
    maxTeams: {
      type: Number,
      required: [true, "Maximum teams is required"],
    },
    rules: {
      type: String,
      trim: true,
    },
    prizeMoney: {
      type: Number,
      default: 0,
    },
    organizerName: {
      type: String,
      required: [true, "Organizer name is required"],
      trim: true,
    },
    organizerPhone: {
      type: String,
      required: [true, "Organizer phone is required"],
      trim: true,
    },
    upiId: {
      type: String,
      trim: true,
    },
    // Tournament status flow
    status: {
      type: String,
      enum: ["upcoming", "registration_open", "registration_closed", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
    // Reference to the admin who created this tournament
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tournament", tournamentSchema);
