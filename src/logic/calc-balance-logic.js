const Decimal = require("decimal.js");

module.exports = function CalculeBalanceLogic(user, value, loss = false) {
  const currentBalance = new Decimal(user.balance.toString());
  const newBalance =
    loss === true ? currentBalance.minus(value) : currentBalance.plus(value);
  const balanceFormatted = newBalance.toFixed(2);

  return {
    currentBalance: currentBalance.toString(),
    balanceFormatted: balanceFormatted,
    value: value.toString(),
  };
};
