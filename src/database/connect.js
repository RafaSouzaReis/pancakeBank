const mongoose = require("mongoose");

module.exports = async () => {
  try {
    console.log("Conectando banco de dados . . .");
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Conectado com sucesso!");
  } catch (error) {
    console.error("Erro ao conectar no MongoDB:", error.message);
    process.exit(1);
  }
};
