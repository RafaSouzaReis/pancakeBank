const User = require("../../database/models/userschema");
const { MessageFlags } = require("discord.js");

async function UserCheck(interaction) {
  const user = await User.findOne({ userId: interaction.user.id });

  if (user) {
    await interaction.reply({
      content: "Usuário já registrado!",
      flags: MessageFlags.ephemeral,
    });
    return true;
  }
  return false;
}

async function UserExist(interaction) {
  const user = await User.findOne({ userId: interaction.user.id });

  if (!user) {
    await interaction.reply({
      content:
        "Você não está registrado. Use `/register-user` para se registrar!",
      flags: MessageFlags.ephemeral,
    });
    return null;
  }
  return user;
}

module.exports = { UserCheck, UserExist };
