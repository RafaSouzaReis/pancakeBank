const Decimal = require("decimal.js");

module.exports = function CalculeBalanceLogic(user, money, loss = false) {
  const currentBalance = new Decimal(user.balance.toString());
  const newBalance =
    loss === true ? currentBalance.minus(money) : currentBalance.plus(money);
  const balanceFormatted = newBalance.toFixed(2);
  return {
    currentBalance: currentBalance.toFixed(2).toString(),
    balanceFormatted: balanceFormatted.toString(),
    money: money.toFixed(2).toString(),
  };
};
