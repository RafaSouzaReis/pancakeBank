const { MessageFlags } = require("discord.js");

async function TargetIsYou(interaction, user, target) {
  if (user.userId === target.userId) {
    await interaction.reply({
      content: "Você não pode fazer uma transferência para si mesmo.",
      flags: MessageFlags.ephemeral,
    });
    return true;
  }
  return false;
}

async function ValuePlusZero(interaction, value) {
  if (value <= 0) {
    await interaction.reply({
      content: "Insira um valor maior que 0!",
      flags: MessageFlags.ephemeral,
    });
    return true;
  }
  return false;
}

async function BalanceCheck(interaction, user, value) {
  if (user.balance < value) {
    await interaction.reply({
      content: "Saldo insuficiente!",
      flags: MessageFlags.ephemeral,
    });
    return true;
  }
  return false;
}

module.exports = { TargetIsYou, ValuePlusZero, BalanceCheck };
