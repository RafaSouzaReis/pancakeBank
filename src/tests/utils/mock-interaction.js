module.exports = function mockInteraction(overrider = {}) {
  return {
    guild: { id: "123456789012345678" },
    user: { id: "987654321098765432" },
    options: {
      getString: jest.fn((name) => {
        if (name === "coin") return "Coinsito";
        if (name === "emoji") return "<a:coin:999999999999999999>";
      }),
      getBoolean: jest.fn((name) => {
        if (name === "emprestimo") return true;
      }),
      getNumber: jest.fn((name) => {
        if (name === "taxa_cambial") return 1.5;
      }),
    },
    reply: jest.fn(),
    ...overrider,
  };
};
