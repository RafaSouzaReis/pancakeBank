const CalculeBalanceLogic = jest
  .fn()
  .mockImplementation((user, money, loss = false) => {
    return {
      currentBalance: "100.00",
      balanceFormatted: loss === true ? "50.00" : "150.00",
      money: loss === true ? "-50.00" : "50.00",
    };
  });

module.exports = CalculeBalanceLogic;
