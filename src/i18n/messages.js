export const messages = {
  pt: {
    errors: {
      errorProcessingRequest:
        "❌ Ocorreu um erro ao processar sua solicitação.",
    },
    success: {
      registerUserSuccess: "✅ Usuario registrado feito com sucesso!",
      registerServerSuccess: "✅ Servidor registrado feito com sucesso!",
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
  },
};
