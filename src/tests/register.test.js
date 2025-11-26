jest.mock("@database/models/guildschema", () =>
  require("@mocks/database/models/guildschema")
);
jest.mock("@helpers/guards/guild-verification", () =>
  require("@mocks/helpers/guards/guild-verification")
);
jest.mock("@i18n/translate", () => require("@mocks/i18n/translate"));
jest.mock("@helpers/middleware/wrappers/wrap-interaction", () =>
  require("@mocks/helpers/middleware/wrappers/wrap-interaction")
);

const Guild = require("@database/models/guildschema");
const {
  isInNotGuild,
  isEmojiNotValid,
  isNotAdmin,
  isGuildExist,
} = require("@helpers/guards/guild-verification");
const translate = require("@i18n/translate");
const wrapInteraction = require("@helpers/middleware/wrappers/wrap-interaction");
const command = require("@commands/configs/register");

describe("Register Command", () => {
  let mockInteraction, mockSave;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSave = jest.fn().mockResolvedValue(true);

    mockInteraction = {
      guild: { id: "guild123" },
      user: { id: "user456" },
      options: {
        getString: jest.fn().mockImplementation((name) => {
          if (name === "coin") return "Bitcoin";
          if (name === "emoji") return "<:coin:111222333444555666>";
          return null;
        }),
        getBoolean: jest.fn().mockImplementation((name) => {
          if (name === "emprestimo") return true;
          return null;
        }),
        getNumber: jest.fn().mockImplementation((name) => {
          if (name === "taxa_cambial") return undefined;
          if (name === "juros_emprestimo") return undefined;
          return null;
        }),
      },
      reply: jest.fn(),
    };

    Guild.mockImplementation((data) => {
      return {
        ...data,
        save: mockSave,
      };
    });

    Guild.findOne.mockResolvedValue(null);

    isInNotGuild.mockResolvedValue(false);
    isNotAdmin.mockResolvedValue(false);
    isEmojiNotValid.mockResolvedValue(false);
    isGuildExist.mockResolvedValue(false);
  });

  describe("✅ Cenário de Sucesso", () => {
    test("should register a guild successfully with static emoji (png)", async () => {
      await command.execute(mockInteraction);

      expect(isInNotGuild).toHaveBeenCalledWith(
        mockInteraction,
        "guild.guildInNotGuild"
      );

      expect(isNotAdmin).toHaveBeenCalledWith(
        mockInteraction,
        "guild.guildAdmin"
      );

      expect(isEmojiNotValid).toHaveBeenCalledWith(
        mockInteraction,
        expect.arrayContaining([
          "<:coin:111222333444555666",
          "111222333444555666",
        ]),
        "guild.guildEmojiNotValid"
      );

      expect(Guild.findOne).toHaveBeenCalledWith({
        guildId: "guild123",
      });

      expect(isGuildExist).toHaveBeenCalledWith(
        mockInteraction,
        null,
        "guild.guildExist"
      );

      expect(Guild).toHaveBeenCalledWith({
        guildId: "guild123",
        coinName: "Bitcoin",
        emojiId: "111222333444555666",
        emojiURL: "https://cdn.discordapp.com/emojis/111222333444555666.png",
        emojiRaw: "<:coin:111222333444555666>",
        ownerId: "user456",
        permitLoan: true,
        extraExchangeRate: undefined,
      });

      expect(mockSave).toHaveBeenCalled();

      expect(wrapInteraction).toHaveBeenCalledWith(
        mockInteraction,
        expect.any(Function)
      );

      expect(translate).toHaveBeenCalledWith("pt", "guild.guildInNotGuild");
      expect(translate).toHaveBeenCalledWith("pt", "guild.guildAdmin");
      expect(translate).toHaveBeenCalledWith("pt", "guild.guildEmojiNotValid");
      expect(translate).toHaveBeenCalledWith("pt", "guild.guildExist");
      expect(translate).toHaveBeenCalledWith(
        "pt",
        "guild.guildRegisterSuccess"
      );
      expect(translate).toHaveBeenCalledTimes(5);
    });

    test("should execute in correct order", async () => {
      await command.execute(mockInteraction);

      expect(isInNotGuild).toHaveBeenCalledBefore(isNotAdmin);
      expect(isNotAdmin).toHaveBeenCalledBefore(isEmojiNotValid);
      expect(isEmojiNotValid).toHaveBeenCalledBefore(Guild.findOne);
      expect(Guild.findOne).toHaveBeenCalledBefore(isGuildExist);
      expect(isGuildExist).toHaveBeenCalledBefore(Guild);
      expect(Guild).toHaveBeenCalledBefore(mockSave);
      expect(mockSave).toHaveBeenCalledBefore(wrapInteraction);
    });

    test("should register guild with animated emoji (gif)", async () => {
      mockInteraction.options.getString.mockImplementation((name) => {
        if (name === "coin") return "Ethereum";
        if (name === "emoji") return "<a:eth:987654321098765432>";
        return null;
      });

      await command.execute(mockInteraction);

      expect(Guild).toHaveBeenCalledWith({
        guildId: "guild123",
        coinName: "Ethereum",
        emojiId: "987654321098765432",
        emojiURL: "https://cdn.discordapp.com/emojis/987654321098765432.gif",
        emojiRaw: "<a:eth:987654321098765432>",
        ownerId: "user456",
        permitLoan: true,
        extraExchangeRate: undefined,
      });

      expect(mockSave).toHaveBeenCalled();
    });

    test("should register guild with static emoji (png)", async () => {
      mockInteraction.options.getString.mockImplementation((name) => {
        if (name === "coin") return "Solana";
        if (name === "emoji") return "<:sol:123456789012345678>";
        return null;
      });

      await command.execute(mockInteraction);

      expect(Guild).toHaveBeenCalledWith({
        guildId: "guild123",
        coinName: "Solana",
        emojiId: "123456789012345678",
        emojiURL: "https://cdn.discordapp.com/emojis/123456789012345678.png",
        emojiRaw: "<:sol:123456789012345678>",
        ownerId: "user456",
        permitLoan: true,
        extraExchangeRate: undefined,
      });

      expect(mockSave).toHaveBeenCalled();
    });

    test("should register guild with loan disabled", async () => {
      mockInteraction.options.getBoolean.mockImplementation((name) => {
        if (name === "emprestimo") return false;
        return null;
      });

      await command.execute(mockInteraction);

      expect(Guild).toHaveBeenCalledWith(
        expect.objectContaining({
          permitLoan: false,
        })
      );

      expect(mockSave).toHaveBeenCalled();
    });

    test("should register guild with exchange rate defined", async () => {
      mockInteraction.options.getNumber.mockImplementation((name) => {
        if (name === "taxa_cambial") return 1.5;
        if (name === "juros_emprestimo") return undefined;
        return null;
      });

      await command.execute(mockInteraction);

      expect(Guild).toHaveBeenCalledWith(
        expect.objectContaining({
          extraExchangeRate: 1.5,
        })
      );

      expect(mockSave).toHaveBeenCalled();
    });

    test("should register guild with zero exchange rate", async () => {
      mockInteraction.options.getNumber.mockImplementation((name) => {
        if (name === "taxa_cambial") return 0;
        if (name === "juros_emprestimo") return undefined;
        return null;
      });

      await command.execute(mockInteraction);

      expect(Guild).toHaveBeenCalledWith(
        expect.objectContaining({
          extraExchangeRate: 0,
        })
      );

      expect(mockSave).toHaveBeenCalled();
    });

    test("should register guild with all options configured", async () => {
      mockInteraction.options.getNumber.mockImplementation((name) => {
        if (name === "taxa_cambial") return 2.5;
        if (name === "juros_emprestimo") return 15;
        return null;
      });

      await command.execute(mockInteraction);

      expect(Guild).toHaveBeenCalledWith({
        guildId: "guild123",
        coinName: "Bitcoin",
        emojiId: "111222333444555666",
        emojiURL: "https://cdn.discordapp.com/emojis/111222333444555666.png",
        emojiRaw: "<:coin:111222333444555666>",
        ownerId: "user456",
        permitLoan: true,
        extraExchangeRate: 2.5,
      });

      expect(mockSave).toHaveBeenCalled();
    });

    test("should register guild with emoji containing underscore", async () => {
      mockInteraction.options.getString.mockImplementation((name) => {
        if (name === "coin") return "Token";
        if (name === "emoji") return "<:my_token_coin:555666777888999000>";
        return null;
      });

      await command.execute(mockInteraction);

      expect(Guild).toHaveBeenCalledWith(
        expect.objectContaining({
          emojiId: "555666777888999000",
          emojiRaw: "<:my_token_coin:555666777888999000>",
          emojiURL: "https://cdn.discordapp.com/emojis/555666777888999000.png",
        })
      );

      expect(mockSave).toHaveBeenCalled();
    });
  });

  describe("❌ Cenários de Erro - Guild Verification", () => {
    describe("when user is not in a guild", () => {
      beforeEach(() => {
        isInNotGuild.mockResolvedValue(true);
      });

      test("should stop execution immediately", async () => {
        await command.execute(mockInteraction);

        expect(isInNotGuild).toHaveBeenCalledWith(
          mockInteraction,
          "guild.guildInNotGuild"
        );

        expect(isNotAdmin).not.toHaveBeenCalled();
        expect(isEmojiNotValid).not.toHaveBeenCalled();
        expect(Guild.findOne).not.toHaveBeenCalled();
        expect(isGuildExist).not.toHaveBeenCalled();
        expect(Guild).not.toHaveBeenCalled();
        expect(mockSave).not.toHaveBeenCalled();
        expect(wrapInteraction).not.toHaveBeenCalled();
      });

      test("should only call necessary translation", async () => {
        await command.execute(mockInteraction);

        expect(translate).toHaveBeenCalledWith("pt", "guild.guildInNotGuild");
        expect(translate).toHaveBeenCalledTimes(1);
      });
    });

    describe("when user is not admin", () => {
      beforeEach(() => {
        isNotAdmin.mockResolvedValue(true);
      });

      test("should stop execution after admin verification", async () => {
        await command.execute(mockInteraction);

        expect(isInNotGuild).toHaveBeenCalled();
        expect(isNotAdmin).toHaveBeenCalledWith(
          mockInteraction,
          "guild.guildAdmin"
        );

        expect(isEmojiNotValid).not.toHaveBeenCalled();
        expect(Guild.findOne).not.toHaveBeenCalled();
        expect(isGuildExist).not.toHaveBeenCalled();
        expect(Guild).not.toHaveBeenCalled();
        expect(mockSave).not.toHaveBeenCalled();
        expect(wrapInteraction).not.toHaveBeenCalled();
      });

      test("should respect execution order", async () => {
        await command.execute(mockInteraction);

        expect(isInNotGuild).toHaveBeenCalledBefore(isNotAdmin);
      });

      test("should call translations up to guildAdmin", async () => {
        await command.execute(mockInteraction);

        expect(translate).toHaveBeenCalledWith("pt", "guild.guildInNotGuild");
        expect(translate).toHaveBeenCalledWith("pt", "guild.guildAdmin");
        expect(translate).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe("❌ Cenários de Erro - Emoji Validation", () => {
    describe("when emoji is invalid", () => {
      beforeEach(() => {
        isEmojiNotValid.mockResolvedValue(true);
      });

      test("should stop execution after emoji validation", async () => {
        await command.execute(mockInteraction);

        expect(isInNotGuild).toHaveBeenCalled();
        expect(isNotAdmin).toHaveBeenCalled();

        expect(isEmojiNotValid).toHaveBeenCalledWith(
          mockInteraction,
          expect.arrayContaining([
            "<:coin:111222333444555666",
            "111222333444555666",
          ]),
          "guild.guildEmojiNotValid"
        );

        expect(Guild.findOne).not.toHaveBeenCalled();
        expect(isGuildExist).not.toHaveBeenCalled();
        expect(Guild).not.toHaveBeenCalled();
        expect(mockSave).not.toHaveBeenCalled();
        expect(wrapInteraction).not.toHaveBeenCalled();
      });

      test("should respect execution order", async () => {
        await command.execute(mockInteraction);

        expect(isInNotGuild).toHaveBeenCalledBefore(isNotAdmin);
        expect(isNotAdmin).toHaveBeenCalledBefore(isEmojiNotValid);
      });

      test("should call translations up to guildEmojiNotValid", async () => {
        await command.execute(mockInteraction);

        expect(translate).toHaveBeenCalledWith("pt", "guild.guildInNotGuild");
        expect(translate).toHaveBeenCalledWith("pt", "guild.guildAdmin");
        expect(translate).toHaveBeenCalledWith(
          "pt",
          "guild.guildEmojiNotValid"
        );
        expect(translate).toHaveBeenCalledTimes(3);
      });
    });
  });

  describe("❌ Cenários de Erro - Guild Existence", () => {
    describe("when guild already exists", () => {
      beforeEach(() => {
        Guild.findOne.mockResolvedValue({
          guildId: "guild123",
          coinName: "Bitcoin",
          ownerId: "user456",
        });
        isGuildExist.mockResolvedValue(true);
      });

      test("should stop execution after existence verification", async () => {
        await command.execute(mockInteraction);

        expect(isInNotGuild).toHaveBeenCalled();
        expect(isNotAdmin).toHaveBeenCalled();
        expect(isEmojiNotValid).toHaveBeenCalled();
        expect(Guild.findOne).toHaveBeenCalledWith({ guildId: "guild123" });
        expect(isGuildExist).toHaveBeenCalledWith(
          mockInteraction,
          {
            guildId: "guild123",
            coinName: "Bitcoin",
            ownerId: "user456",
          },
          "guild.guildExist"
        );

        expect(Guild).not.toHaveBeenCalled();
        expect(mockSave).not.toHaveBeenCalled();
        expect(wrapInteraction).not.toHaveBeenCalled();
      });

      test("should respect execution order", async () => {
        await command.execute(mockInteraction);

        expect(isInNotGuild).toHaveBeenCalledBefore(isNotAdmin);
        expect(isNotAdmin).toHaveBeenCalledBefore(isEmojiNotValid);
        expect(isEmojiNotValid).toHaveBeenCalledBefore(Guild.findOne);
        expect(Guild.findOne).toHaveBeenCalledBefore(isGuildExist);
      });

      test("should call all translations up to guildExist", async () => {
        await command.execute(mockInteraction);

        expect(translate).toHaveBeenCalledWith("pt", "guild.guildInNotGuild");
        expect(translate).toHaveBeenCalledWith("pt", "guild.guildAdmin");
        expect(translate).toHaveBeenCalledWith(
          "pt",
          "guild.guildEmojiNotValid"
        );
        expect(translate).toHaveBeenCalledWith("pt", "guild.guildExist");
        expect(translate).toHaveBeenCalledTimes(4);
      });
    });
  });

  describe("🔧 Verificações de Configuração", () => {
    test("should have correct command configuration", () => {
      expect(command.cooldown).toBe(5);
      expect(command.data).toBeDefined();
      expect(command.data.name).toBe("register");
      expect(command.data.description).toBe("Register server");
      expect(command.execute).toBeInstanceOf(Function);
    });

    test("should have required options configured", () => {
      const options = command.data.options;

      const coinOption = options.find((opt) => opt.name === "coin");
      expect(coinOption).toBeDefined();
      expect(coinOption.required).toBe(true);

      const emojiOption = options.find((opt) => opt.name === "emoji");
      expect(emojiOption).toBeDefined();
      expect(emojiOption.required).toBe(true);

      const emprestimoOption = options.find((opt) => opt.name === "emprestimo");
      expect(emprestimoOption).toBeDefined();
      expect(emprestimoOption.required).toBe(true);
    });

    test("should have optional options configured", () => {
      const options = command.data.options;

      const jurosOption = options.find(
        (opt) => opt.name === "juros_emprestimo"
      );
      expect(jurosOption).toBeDefined();
      expect(jurosOption.required).toBeFalsy();

      const taxaOption = options.find((opt) => opt.name === "taxa_cambial");
      expect(taxaOption).toBeDefined();
      expect(taxaOption.required).toBeFalsy();
    });

    test("should have 5 total options", () => {
      expect(command.data.options).toHaveLength(5);
    });
  });

  describe("🧪 Testes de Integração - Edge Cases", () => {
    test("should determine gif extension for animated emoji correctly", async () => {
      mockInteraction.options.getString.mockImplementation((name) => {
        if (name === "coin") return "Doge";
        if (name === "emoji") return "<a:doge:222222222222222222>";
        return null;
      });

      await command.execute(mockInteraction);

      const calledWith = Guild.mock.calls[0][0];
      expect(calledWith.emojiURL).toContain(".gif");
      expect(calledWith.emojiURL).not.toContain(".png");
    });

    test("should determine png extension for static emoji correctly", async () => {
      mockInteraction.options.getString.mockImplementation((name) => {
        if (name === "coin") return "Star";
        if (name === "emoji") return "<:star:333333333333333333>";
        return null;
      });

      await command.execute(mockInteraction);

      const calledWith = Guild.mock.calls[0][0];
      expect(calledWith.emojiURL).toContain(".png");
      expect(calledWith.emojiURL).not.toContain(".gif");
    });

    test("should process negative exchange rate", async () => {
      mockInteraction.options.getNumber.mockImplementation((name) => {
        if (name === "taxa_cambial") return -1.5;
        if (name === "juros_emprestimo") return undefined;
        return null;
      });

      await command.execute(mockInteraction);

      expect(Guild).toHaveBeenCalledWith(
        expect.objectContaining({
          extraExchangeRate: -1.5,
        })
      );
    });

    test("should process very high exchange rate", async () => {
      mockInteraction.options.getNumber.mockImplementation((name) => {
        if (name === "taxa_cambial") return 999999.99;
        if (name === "juros_emprestimo") return undefined;
        return null;
      });

      await command.execute(mockInteraction);

      expect(Guild).toHaveBeenCalledWith(
        expect.objectContaining({
          extraExchangeRate: 999999.99,
        })
      );
    });
  });
});
