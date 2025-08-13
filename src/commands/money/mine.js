const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const {
  InGuild,
  ReceivedZero,
  UserExist,
  GuildExist,
} = require("../../services/export");

const Decimal = require("decimal.js");

module.exports = {
  cooldown: 30,
  data: new SlashCommandBuilder().setName("mine").setDescription("Miner coin"),
  async execute(interaction) {
    const randomNumber = Math.random() * (100000 - 1) + 1;
    const received = new Decimal(
      randomNumber === 100000 ? 2000 : Math.random() * (200 - 0) + 0
    );

    const inGuild = await InGuild(interaction);
    if (!inGuild) {
      return;
    }

    const server = await GuildExist(interaction);
    if (!server) {
      return;
    }

    const user = await UserExist(interaction);
    if (!user) {
      return;
    }

    if (await ReceivedZero(interaction, received)) {
      return;
    }
    const coin = server.coinName;
    const emoji = server.emojiRaw;
    const currentBalance = new Decimal(user.balance.toString());
    const newBalance = currentBalance.plus(received);
    const newBalanceFormatted = newBalance.toFixed(2);
    user.balance = newBalanceFormatted.toString();
    await user.save();

    const embed = new EmbedBuilder()
      .setColor("Gold")
      .setTitle(":moneybag:Miner:moneybag: ")
      .setDescription(
        `Voce mineirou em ${coin} o valor:\n${emoji}$${received.toFixed(2)}`
      )
      .addFields(
        {
          name: "Saldo Anterior:",
          value: `${emoji}$${currentBalance.toFixed(2)}`,
          inline: true,
        },
        {
          name: "\u200B",
          value: "->",
          inline: true,
        },
        {
          name: "Saldo Atual:",
          value: `${emoji}$${newBalanceFormatted}`,
          inline: true,
        }
      )
      .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `Banco do Servidor • ${interaction.guild.name}` })
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
