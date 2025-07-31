jest.mock("../services/export");
jest.mock("../database/models/userschema", () =>
  require("./mocks/database/models/userschema")
);

const { GuildCheck, InGuild, UserExist } = require("../services/export");
const Guild = require("../database/models/guildschema");
const User = require("../database/models/userschema");
const command = require("../commands/configs/register-user");

describe("/register-user", () => {
  let mockInteraction;

  beforeEach(() => {
    jest.clearAllMocks();
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
    GuildCheck.mockResolvedValue(true);
    InGuild.mockResolvedValue(true);
    UserExist.mockResolvedValue(false);
  });

  test("Deve retornar usuario registrado com sucesso", async () => {
    await command.execute(mockInteraction);
    expect(InGuild).toHaveBeenCalledWith(mockInteraction);
    expect(GuildCheck).toHaveBeenCalledWith(mockInteraction);
    expect(UserExist).toHaveBeenCalledWith(mockInteraction);

    expect(User).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: mockInteraction.user.id,
        guildId: mockInteraction.guild.id,
      })
    );
    const userInstance = User.mock.results[0].value;
    expect(userInstance.save).toHaveBeenCalled();

    expect(mockInteraction.reply).toHaveBeenCalledWith({
      content: "Registro feito com sucesso!",
      flags: expect.any(Number),
    });
  });
});
