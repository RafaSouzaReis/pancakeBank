const LootLogic = jest.fn().mockImplementation((rules, morePorcent = false) => {
  const roll = 100;
  for (const rule of rules) {
    if (roll <= rule.chance) {
      return typeof rule.reward === "function" ? rule.reward() : rule.reward;
    }
  }
  return 0;
});

module.exports = LootLogic;
