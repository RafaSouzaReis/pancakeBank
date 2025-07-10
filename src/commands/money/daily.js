const { SlashCommandBuilder, MessageFlags, EmbedBuilder } =
  required("discord.js");
const User = require("../../database/models/userschema");
const Guild = require("../../database/models/guildschema");
const Decimal = require("decimal.js");
const { cooldown } = require("../wallet/balance");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder(),
  async execute(interaction) {
    const server = await Guild.findOne({ guildId: interaction.guild.id });

    if (!server) {
      await interaction.reply({
        content:
          "Você não esta registrado, utilize `/register-user` para se registrar!",
        ephemeral: MessageFlags.ephemeral,
      });
    }
  },
};
