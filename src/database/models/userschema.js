const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    balance: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      default: 0,
    },
    totalEarned: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    totalSpent: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    loan: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    loanDate: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
