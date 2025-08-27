jest.mock("../services/export");
jest.mock("../database/models/guildschema", () =>
  require("./__mocks__/database/models/guildschema")
);

const {
  isInGuild,
  isEmojiValid,
  isAdmin,
  isGuildExist,
} = require("../services/export");
const Guild = require("../database/models/guildschema");
const command = require("../commands/configs/register");

describe("/register", () => {
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
    isInGuild.mockResolvedValue(true);
    isEmojiValid.mockResolvedValue(true);
    isAdmin.mockResolvedValue(true);
    isGuildExist.mockResolvedValue(true);
  });

  describe("Fluxo principal", () => {
    test("Deve retornar sucesso no registro", async () => {
      await command.execute(mockInteraction);

      expect(isInGuild).toHaveBeenCalledWith(mockInteraction);

      const emoji = mockInteraction.options.getString("emoji");
      const emojiMatch = emoji.match(/.*?:.*?:(\d+)/);
      const regexGif = /^<a?:[a-zA-Z0-9_]+:\d+>$/;

      expect(isEmojiValid).toHaveBeenCalledWith(emojiMatch, mockInteraction);
      expect(isAdmin).toHaveBeenCalledWith(mockInteraction);

      const emojiId = emojiMatch[1];
      const emojiURL = `https://cdn.discordapp.com/emojis/${emojiId}.${
        regexGif.test(emoji) ? "gif" : "png"
      }`;
      expect(isGuildExist).toHaveBeenCalledWith(mockInteraction);

      expect(Guild).toHaveBeenCalledWith(
        expect.objectContaining({
          guildId: mockInteraction.guild.id,
          coinName: mockInteraction.options.getString("coin"),
          ownerId: mockInteraction.user.id,
          emojiId: emojiId,
          emojiURL: emojiURL,
          emojiRaw: mockInteraction.options.getString("emoji"),
          permitLoan: mockInteraction.options.getBoolean("emprestimo"),
          extraExchangeRate:
            mockInteraction.options.getNumber("taxa_cambial") ?? undefined,
        })
      );
      const guildInstance = Guild.mock.results[0].value;
      expect(guildInstance.save).toHaveBeenCalled();

      expect(mockInteraction.reply).toHaveBeenCalledWith({
        content: "Registro feito com sucesso!",
        flags: expect.any(Number),
      });
    });
  });

  describe("isInGuild", () => {
    test("Deve retornar sem executar se isInGuild for falso", async () => {
      isInGuild.mockResolvedValue(false);

      await command.execute(mockInteraction);

      expect(isInGuild).toHaveBeenCalledWith(mockInteraction);
      expect(isEmojiValid).not.toHaveBeenCalled();
      expect(isAdmin).not.toHaveBeenCalled();
      expect(isGuildExist).not.toHaveBeenCalled();
      expect(Guild).not.toHaveBeenCalled();
      expect(mockInteraction.reply).not.toHaveBeenCalled();
    });
  });

  describe("isEmojiValid", () => {
    test("Deve retornar sem executar se emoji for inválido", async () => {
      mockInteraction.options.getString = jest.fn((name) => {
        if (name === "coin") return "Coinsito";
        if (name === "emoji") return "invalidEmojiFormat";
      });
      isEmojiValid.mockResolvedValue(false);

      await command.execute(mockInteraction);

      expect(isInGuild).toHaveBeenCalledWith(mockInteraction);
      expect(isEmojiValid).toHaveBeenCalled();
      expect(isAdmin).not.toHaveBeenCalled();
      expect(isGuildExist).not.toHaveBeenCalled();
      expect(Guild).not.toHaveBeenCalled();
      expect(mockInteraction.reply).not.toHaveBeenCalled();
    });
  });

  describe("isAdmin", () => {
    test("Deve retornar sem executar se isAdmin for falso", async () => {
      isEmojiValid.mockResolvedValue(true);
      isAdmin.mockResolvedValue(false);

      await command.execute(mockInteraction);

      expect(isInGuild).toHaveBeenCalledWith(mockInteraction);
      expect(isEmojiValid).toHaveBeenCalled();
      expect(isAdmin).toHaveBeenCalledWith(mockInteraction);
      expect(isGuildExist).not.toHaveBeenCalled();
      expect(Guild).not.toHaveBeenCalled();
      expect(mockInteraction.reply).not.toHaveBeenCalled();
    });
  });

  describe("isGuildExist", () => {
    test("Deve retornar sem executar se isGuildExist for falso", async () => {
      isEmojiValid.mockResolvedValue(true);
      isAdmin.mockResolvedValue(true);
      isGuildExist.mockResolvedValue(false);

      await command.execute(mockInteraction);

      expect(isInGuild).toHaveBeenCalledWith(mockInteraction);
      expect(isEmojiValid).toHaveBeenCalled();
      expect(isAdmin).toHaveBeenCalledWith(mockInteraction);
      expect(isGuildExist).toHaveBeenCalled();
      expect(Guild).not.toHaveBeenCalled();
      expect(mockInteraction.reply).not.toHaveBeenCalled();
    });
  });

  describe("Opções e casos especiais", () => {
    test("Deve registrar com juros_emprestimo undefined se não fornecido", async () => {
      mockInteraction.options.getNumber = jest.fn((name) => {
        if (name === "taxa_cambial") return 1.5;
        return undefined;
      });

      await command.execute(mockInteraction);

      expect(Guild).toHaveBeenCalledWith(
        expect.objectContaining({
          extraExchangeRate: 1.5,
        })
      );
    });

    test("Deve registrar com juros_emprestimo definido se fornecido", async () => {
      mockInteraction.options.getNumber = jest.fn((name) => {
        if (name === "taxa_cambial") return 1.5;
        if (name === "juros_emprestimo") return 0.05;
        return undefined;
      });

      await command.execute(mockInteraction);

      expect(Guild).toHaveBeenCalledWith(
        expect.objectContaining({
          extraExchangeRate: 1.5,
        })
      );
    });
  });

  describe("Cooldown existe? e é um numero ?", () => {
    test("Deve ter cooldown 5", () => {
      expect(command).toHaveProperty("cooldown");
      expect(typeof command.cooldown).toBe("number");
    });
  });
});
