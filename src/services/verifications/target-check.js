const User = require("../../database/models/userschema");
const { MessageFlags } = require("discord.js");

async function TargetExist(interaction, target) {
  if (!target) {
    await interaction.reply({
      content:
        "Membro não está registrado. Peça para que ele use o comando `/register-user` para se registrar!",
      flags: MessageFlags.ephemeral,
    });
    return null;
  }
  return await User.findOne({ userId: target.id });
}

module.exports = TargetExist;
