const messages = {
  pt: {
    errors: {
      errorProcessingRequest: "❌ Ocorreu um erro ao executar o {command}",
    },
    user: {
      userCheck: "✅ Usuario já registrado!",
      userNotCheck:
        "❌ Usuario não registrado, por favor use `/register-user` para se registrar!",
      userTarget: "❌ Usuario alvo não encontrado!",
      userTargetSelf: "❌ Você não pode fazer uma transferência para si mesmo.",
    },
    guild: {
      guildCheck: "✅ Servidor já registrado!",
      guildNotCheck:
        "❌ Servidor não registrado, por favor use `/register` para registrar o servidor!",
      guildInGuild:
        "❌ Este comando só pode ser executado dentro de um servidor.",
      guildAdmin: "❌ Apenas administradores podem usar este comando.",
      guildEmojiValid:
        "❌ Emoji Inválido, Por favor utilize um emoji personalizado do servidor!",
    },
    daily: {
      dailyAlreadyClaimed: "❌ Você já coletou sua recompensa, tente amanhã!",
    },
    balance: {
      balanceValueValid: "❌ O valor deve ser maior que zero!",
      balanceReceivedZero:
        "⛏️ Nada foi encontrado desta vez... tente novamente mais tarde!",
    },
    daily: {
      title: ":fortune_cookie: Daily :fortune_cookie:",
      description: "Você recebeu em {coinName} o valor:\n{emoji}${amount}",
      previousBalance: "Saldo Anterior:",
      currentBalance: "Saldo Atual:",
      footer: "Banco do Servidor • {guildName}",
    },
    mine: {
      title: ":pick: Mine :pick:",
      description: "Você mineirou em {coinName} o valor:\n{emoji}${amount}",
      previousBalance: "Saldo Anterior:",
      currentBalance: "Saldo Atual:",
      footer: "Banco do Servidor • {guildName}",
    },
    transfer: {
      title: ":money_with_wings: Transferência Realizada :money_with_wings:",
      description:
        "Você transferiu **{emoji}${amount} {coinName}** para **{target}**.",
      previousBalance: "Seu Saldo Anterior:",
      currentBalance: "Seu Saldo Atual:",
      previousBalanceTarget: "Saldo Anterior de {target}:",
      currentBalanceTarget: "Saldo Atual de {target}:",
      footer: "Banco do Servidor • {guildName}",
    },
    balance: {
      title: ":coin:  Saldo de {userName}! :coin:",
      description: "Veja abaixo o saldo atual em {coin}",
      fieldName: "Saldo",
      footer: "Banco do Servidor • {guildName}",
    },
  },
};

module.exports = messages;
