const User = require("../../database/models/userschema");

async function AlreadyClaimed(interaction, now, user) {
  const alreadyClaimed =
    user.lastDaily &&
    user.lastDaily.getDate() === now.getDate() &&
    user.lastDaily.getMonth() === now.getMonth() &&
    user.lastDaily.getFullYear() === now.getFullYear();

  if (alreadyClaimed) {
    await interaction.reply({
      content: "Você ja coletou sua recompensa, tente amanha!",
      flags: MessageFlags.ephemeral,
    });
    return false;
  }
  return true;
}

module.exports = AlreadyClaimed;
