// ============================================
// models/Payment.js - Payment Schema
// ============================================

const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    // Which team made this payment
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    // Which tournament this payment is for
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    },
    amount: {
      type: Number,
      required: [true, "Payment amount is required"],
    },
    transactionId: {
      type: String,
      trim: true,
    },
    // Filename of the uploaded screenshot
    screenshot: {
      type: String,
      default: "",
    },
    // Admin verifies or rejects payment
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    adminNote: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
