const mongoose = require("mongoose");

const StoreSchema = new mongoose.Schema(
  {
    guildId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: mongoose.Schema.Types.Decimal128, required: true },
    type: { type: String, required: true },
    data: { type: String },
    stock: { type: Number, default: null },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Store", StoreSchema);
