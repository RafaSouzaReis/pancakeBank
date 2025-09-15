const balanceEmbed = require("../bicep/embeds/balance-embed");
const dailyEmbed = require("../bicep/embeds/daily-embed");
const mineEmbed = require("../bicep/embeds/mine-embed");
const transferEmbed = require("../bicep/embeds/transfer-embed");

const messages = {
  pt: {
    errors: {
      errorProcessingRequest: "❌ Ocorreu um erro ao executar o {command}",
    },
    user: {
      userRegisterSuccess: "✅ Usuario registrado com sucesso!",
      userExist: "✅ Usuario já registrado!",
      userNotExist:
        "❌ Usuario não registrado, por favor use `/register-user` para se registrar!",
      userTargetNotExist: "❌ Usuario alvo não encontrado!",
      userTargetSelf: "❌ Você não pode fazer uma transferência para si mesmo.",
    },
    guild: {
      guildRegisterSuccess: "✅ Servidor registrado com sucesso!",
      guildExist: "✅ Servidor já registrado!",
      guildNotExist:
        "❌ Servidor não registrado, por favor use `/register` para registrar o servidor!",
      guildInNotGuild:
        "❌ Este comando só pode ser executado dentro de um servidor.",
      guildAdmin: "❌ Apenas administradores podem usar este comando.",
      guildEmojiNotValid:
        "❌ Emoji Inválido, Por favor utilize um emoji personalizado do servidor!",
    },
    daily: {
      dailyAlreadyClaimed: "❌ Você já coletou sua recompensa, tente amanhã!",
    },
    balance: {
      balanceValueValid: "❌ O valor deve ser maior que zero!",
      balanceReceivedZero:
        "⛏️ Nada foi encontrado desta vez... tente novamente mais tarde!",
      balanceCheck: "❌ Saldo insuficiente para completar esta ação!",
    },
    dailyEmbed: {
      title: ":fortune_cookie: Daily :fortune_cookie:",
      description: "Você recebeu em {coinName} o valor:\n{emoji}${amount}",
      previousBalance: "Saldo Anterior:",
      currentBalance: "Saldo Atual:",
      footer: "Banco do Servidor • {guildName}",
    },
    mineEmbed: {
      title: ":pick: Mine :pick:",
      description: "Você mineirou em {coinName} o valor:\n{emoji}${amount}",
      previousBalance: "Saldo Anterior:",
      currentBalance: "Saldo Atual:",
      footer: "Banco do Servidor • {guildName}",
    },
    transferEmbed: {
      title: ":money_with_wings: Transferência Realizada :money_with_wings:",
      description:
        "Você transferiu **{emoji}${amount} {coinName}** para **{target}**.",
      previousBalance: "Seu Saldo Anterior:",
      currentBalance: "Seu Saldo Atual:",
      previousBalanceTarget: "Saldo Anterior de {target}:",
      currentBalanceTarget: "Saldo Atual de {target}:",
      footer: "Banco do Servidor • {guildName}",
    },
    balanceEmbed: {
      title: ":coin:  Saldo de {userName}! :coin:",
      description: "Veja abaixo o saldo atual em {coin}",
      fieldName: "Saldo",
      footer: "Banco do Servidor • {guildName}",
    },
  },
};

module.exports = messages;
