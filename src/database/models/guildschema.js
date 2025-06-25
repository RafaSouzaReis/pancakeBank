const mongoose = require("mongoose");

const GuildScheme = new mongoose.Schema({
  guildId: { type: String, required: true },
  coinName: { type: String, required: true },
  emojiId: { type: String, required: true },
  emojiURL: { type: String, required: true },
  emojiRaw: { type: String, required: true },
  ownerId: { type: String, required: true },
  inflation: { type: Number, default: 0 },
  inflationHistory: { type: Array, default: [] },
  permitLoan: { type: Boolean, default: true },
  loanInterest: { type: mongoose.Schema.Types.Decimal128, default: 0.05 },
  extraExchangeRate: { type: mongoose.Schema.Types.Decimal128, default: 0.02 },
  dateCreate: { type: Date, default: Date.now },
  lastDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Guild", GuildScheme);
