const { MessageFlags } = require("discord.js");

async function UserCheck(interaction, user) {
  if (user) {
    await interaction.reply({
      content: "Usuário já registrado!",
      flags: MessageFlags.ephemeral,
    });
    return true;
  }
  return false;
}

async function UserExist(interaction, user, target = false) {
  if (!user) {
    await interaction.reply({
      content: target
        ? "Membro não está registrado. Peça para que ele use o comando `/register-user` para se registrar!"
        : "Você não está registrado. Use `/register-user` para se registrar!",
      flags: MessageFlags.ephemeral,
    });
    return false;
  }
  return true;
}

module.exports = { UserCheck, UserExist };
