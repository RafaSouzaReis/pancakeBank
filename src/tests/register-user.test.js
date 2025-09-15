jest.mock("../services/export");
jest.mock("../database/models/userschema", () =>
  require("./__mocks__/database/models/userschema")
);

const { isInNotGuild, UserExist, isGuildExist } = require("../services/export");
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
    isInNotGuild.mockResolvedValue(true);
    isGuildExist.mockResolvedValue(true);
    UserExist.mockResolvedValue(false);
  });

  describe("Fluxo principal", () => {
    test("Deve retornar usuario registrado com sucesso", async () => {
      await command.execute(mockInteraction);
      expect(isInNotGuild).toHaveBeenCalledWith(mockInteraction);
      expect(isGuildExist).toHaveBeenCalledWith(mockInteraction);
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

  describe("isInNotGuild", () => {
    test("Deve retornar sem executar se o isInNotGuild for false", async () => {
      isInNotGuild.mockResolvedValue(false);
      await command.execute(mockInteraction);
      expect(isInNotGuild).toHaveBeenCalledWith(mockInteraction);
      expect(isGuildExist).not.toHaveBeenCalled();
      expect(UserExist).not.toHaveBeenCalled();
      expect(User).not.toHaveBeenCalled();
    });
  });

  describe("isGuildExist", () => {
    test("Deve retornar sem executar se o isGuildExist for false", async () => {
      isGuildExist.mockResolvedValue(false);
      await command.execute(mockInteraction);
      expect(isInNotGuild).toHaveBeenCalledWith(mockInteraction);
      expect(isGuildExist).toHaveBeenCalledWith(mockInteraction);
      expect(UserExist).not.toHaveBeenCalled();
      expect(User).not.toHaveBeenCalled();
    });
  });

  describe("UserExist", () => {
    test("Deve retornar sem executar se o UserExist for true", async () => {
      UserExist.mockResolvedValue(true);
      await command.execute(mockInteraction);
      expect(isInNotGuild).toHaveBeenCalledWith(mockInteraction);
      expect(isGuildExist).toHaveBeenCalledWith(mockInteraction);
      expect(UserExist).toHaveBeenCalledWith(mockInteraction);
      expect(User).not.toHaveBeenCalled();
    });
  });
});
