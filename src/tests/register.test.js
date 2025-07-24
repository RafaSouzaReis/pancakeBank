jest.mock("../services/export");
jest.mock("../database/models/guildschema");

const {
  InGuild,
  EmojiCheck,
  ADMCheck,
  GuildExist,
} = require("../services/export");
const Guild = require("../database/models/guildschema");
const command = require("../commands/configs/register");
console.log("Guild.mock", Guild.mock);

describe("/register", () => {
  let mockInteraction;

  beforeEach(() => {
    mockInteraction = {
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
    };
    InGuild.mockResolvedValue(true);
    EmojiCheck.mockResolvedValue(true);
    ADMCheck.mockResolvedValue(true);
    GuildExist.mockResolvedValue(true);
  });

  test("deve registrar com sucesso", async () => {
    await command.execute(mockInteraction);

    expect(InGuild).toHaveBeenCalledWith(mockInteraction);
    expect(EmojiCheck).toHaveBeenCalled();
    expect(ADMCheck).toHaveBeenCalled();
    expect(GuildExist).toHaveBeenCalledWith(mockInteraction);

    expect(Guild).toHaveBeenCalledWith(
      expect.objectContaining({
        guildId: "123456789012345678",
        coinName: "Coinsito",
        ownerId: "987654321098765432",
        emojiRaw: "<a:coin:999999999999999999>",
        permitLoan: true,
        extraExchangeRate: 1.5,
      })
    );
    const guildInstance = Guild.mock.results[0].value;
    expect(guildInstance.save).toHaveBeenCalled();

    expect(mockInteraction.reply).toHaveBeenCalledWith({
      content: "registro feito com sucesso!",
      flags: expect.any(Number),
    });
  });
});
