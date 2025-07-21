const Guild = require("../../database/models/guildschema");
const { MessageFlags } = require("discord.js");

async function GuildCheck(interaction) {
  const server = await Guild.findOne({ guildId: interaction.guild.id });

  if (server) {
    await interaction.reply({
      content: "Servidor já registrado",
      flags: MessageFlags.ephemeral,
    });
    return true;
  }
  return false;
}

async function GuildExist(interaction) {
  const server = await Guild.findOne({ guildId: interaction.guild.id });

  if (!server) {
    await interaction.reply({
      content:
        "Servidor não registrado. Peça ao administrador que use `/register` para registrar o servidor.",
      flags: MessageFlags.ephemeral,
    });
    return null;
  }

  return server;
}

async function InGuild(interaction) {
  if (!interaction.inGuild()) {
    await interaction.reply({
      content: "❌ Este comando só pode ser executado dentro de um servidor.",
      flags: MessageFlags.ephemeral,
    });
    return false;
  }
  return true;
}

module.exports = { GuildCheck, GuildExist, InGuild };
