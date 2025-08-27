const { MessageFlags } = require("discord.js");

async function isDailyAlreadyClaimed(interaction, now, user, mode = "24h") {
  let alreadyClaimed = false;

  if (user.lastDaily) {
    if (mode === "24h") {
      alreadyClaimed = now - user.lastDaily < 86400000;
    } else if (mode === "daily") {
      alreadyClaimed = user.lastDaily.toDateString() === now.toDateString();
    }
  }

  if (alreadyClaimed) {
    await interaction.reply({
      content: "Você já coletou sua recompensa, tente amanhã!",
      flags: MessageFlags.ephemeral,
    });
    return false;
  }
  return true;
}

module.exports = {
  isDailyAlreadyClaimed,
};
