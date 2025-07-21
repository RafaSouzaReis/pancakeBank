const { MessageFlags } = require("discord.js");

async function ADMCheck(interaction) {
  if (!interaction.member.permissions.has("Administrator")) {
    await interaction.reply({
      content: "❌ Apenas administradores podem usar este comando.",
      flags: MessageFlags.Ephemeral,
    });
    return false;
  }
  return true;
}

module.exports = ADMCheck;
