module.exports = function LootLogic(rules, morePorcent = false) {
  const roll =
    morePorcent === true
      ? Math.floor(Math.random() * 1000) + 1
      : Math.floor(Math.random() * 100) + 1;
  for (const rule of rules) {
    if (roll <= rule.chance) {
      return typeof rule.reward === "function" ? rule.reward() : rule.reward;
    }
  }
};
