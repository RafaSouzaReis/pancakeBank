const mongoose = require("mongoose");

const LogsSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  userId: { type: String, required: true },
  targetId: { type: String, required: true },
  type: { type: String, required: true },
  amount: { type: mongoose.Schema.Types.Decimal128 },
  description: { type: String },
  date: { type: Date, default: Date.now },
});
