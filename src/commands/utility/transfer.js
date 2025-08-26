const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Decimal = require("decimal.js");
const {
  GuildExist,
  UserExist,
  InGuild,
  ValueCheck,
  BalanceCheck,
  TargetIsYou,
  TargetExist,
} = require("../../services/export");
const CalculeBalanceLogic = require("../../logic/calc-balance-logic");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("transfer")
    .setDescription("Marque algum amigo")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("usuario que vai receber a quantia")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("valor")
        .setDescription("valor a ser enviado")
        .setRequired(true)
    ),
  async execute(interaction) {
    const target = interaction.options.getUser("target");
    const value = interaction.options.getNumber("valor");

    const inGuild = await InGuild(interaction);
    if (!inGuild) {
      return;
    }

    const server = await GuildExist(interaction);
    if (!server) {
      return;
    }

    const user = await UserExist(interaction, target);
    if (!user) {
      return;
    }

    const targetUser = TargetExist(target);
    if (!targetUser) {
      return;
    }

    if (TargetIsYou) {
      return;
    }

    if (await ValueCheck(interaction, value)) {
      return;
    }

    if (await BalanceCheck(interaction, user, value)) {
      return;
    }

    const coin = await server.coinName;
    const emoji = await server.emojiRaw;
    const emojiURL = await server.emojiURL;

    const { currentBalance, balanceFormatted, money } = CalculeBalanceLogic(
      user,
      value,
      true
    );

    const {
      currentBalance: currentBalanceTarget,
      balanceFormatted: balanceFormattedTarget,
      money: moneyTarget,
    } = CalculeBalanceLogic(user, value);

    await user.save();
    await targetUser.save();

    const embed = new EmbedBuilder()
      .setColor("Gold")
      .setTitle(":money_with_wings: Transferência Realizada :money_with_wings:")
      .setDescription(
        `Você transferiu **${emoji}$${value.toFixed(2)} ${coin}** para **${
          target.username
        }**.`
      )
      .addFields(
        {
          name: "Seu Saldo Anterior:",
          value: `${emoji}$${currentBalanceDecimalUser.toFixed(2)}`,
          inline: true,
        },
        {
          name: "\u200B",
          value: "→",
          inline: true,
        },
        {
          name: "Seu Saldo Atual:",
          value: `${emoji}$${newBalanceDecimalUserFormatted}`,
          inline: true,
        },
        { name: "\u200B", value: "\u200B", inline: false },
        {
          name: `Saldo Anterior de ${target.username}:`,
          value: `${emoji}$${currentBalanceDecimalTarget.toFixed(2)}`,
          inline: true,
        },
        {
          name: "\u200B",
          value: "→",
          inline: true,
        },
        {
          name: `Saldo Atual de ${target.username}:`,
          value: `${emoji}$${newBalanceDecimalTargetFormatted}`,
          inline: true,
        }
      )
      .setThumbnail(emojiURL)
      .setFooter({ text: `Banco do Servidor • ${interaction.guild.name}` })
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
