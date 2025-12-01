jest.mock("@database/models/userschema", () =>
  require("@mocks/database/models/userschema")
);
jest.mock("@database/models/guildschema", () =>
  require("@mocks/database/models/guildschema")
);
jest.mock("@helpers/guards/guild-verification", () =>
  require("@mocks/helpers/guards/guild-verification")
);
jest.mock("@helpers/guards/user-verification", () =>
  require("@mocks/helpers/guards/user-verification")
);
jest.mock("@helpers/guards/daily-verification", () =>
  require("@mocks/helpers/guards/daily-verification")
);
jest.mock("@services/calc-balance-logic", () =>
  require("@mocks/services/calc-balance-logic")
);
jest.mock("@services/loot-logic", () => require("@mocks/services/loot-logic"));
jest.mock("@bicep/embeds/daily-embed", () =>
  require("@mocks/bicep/embeds/daily-embed")
);
jest.mock("@helpers/middleware/wrappers/wrap-interaction", () =>
  require("@mocks/helpers/middleware/wrappers/wrap-interaction")
);
jest.mock("@i18n/translate", () => require("@mocks/i18n/translate"));

const User = require("@database/models/userschema");
const Guild = require("@database/models/guildschema");
const {
  isInNotGuild,
  isGuildNotExist,
} = require("@helpers/guards/guild-verification");
const { isUserNotExist } = require("@helpers/guards/user-verification");
const { isDailyAlreadyClaimed } = require("@helpers/guards/daily-verification");

const CalculeBalanceLogic = require("@services/calc-balance-logic");
const LootLogic = require("@services/loot-logic");
const createDailyEmbed = require("@bicep/embeds/daily-embed");
const wrapInteraction = require("@helpers/middleware/wrappers/wrap-interaction");
const translate = require("@i18n/translate");
const command = require("@commands/money/daily");

describe("Daily Command", () => {
  let mockInteraction, mockSave, mockUser, mockGuild;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSave = jest.fn().mockResolvedValue(true);

    mockUser = {
      userId: "user123",
      balance: 1000,
      lastDaily: null,
      save: mockSave,
    };

    mockGuild = {
      guildId: "guild123",
      coinName: "Pancake",
      emojiRaw: "🥞",
    };

    User.findOne.mockResolvedValue(mockUser);
    Guild.findOne.mockResolvedValue(mockGuild);

    // Configura todos os guards para retornar false (permitir execução)
    isInNotGuild.mockResolvedValue(false);
    isGuildNotExist.mockResolvedValue(false);
    isUserNotExist.mockResolvedValue(false);
    isDailyAlreadyClaimed.mockResolvedValue(false);

    mockInteraction = {
      guild: { id: "guild123", name: "Test Guild" },
      user: {
        id: "user123",
        displayAvatarURL: jest.fn().mockReturnValue("avatar-url"),
      },
      reply: jest.fn().mockResolvedValue(true),
      editReply: jest.fn().mockResolvedValue(true),
    };
  });

  describe("✅ Cenário de Sucesso", () => {
    test("deve receber daily reward com sucesso", async () => {
      await command.execute(mockInteraction);

      expect(isInNotGuild).toHaveBeenCalledWith(
        mockInteraction,
        "guild.guildInNotGuild"
      );
      expect(Guild.findOne).toHaveBeenCalledWith({ guildId: "guild123" });
      expect(isGuildNotExist).toHaveBeenCalledWith(
        mockInteraction,
        mockGuild,
        "guild.guildNotExist"
      );
      expect(User.findOne).toHaveBeenCalledWith({ userId: "user123" });
      expect(isUserNotExist).toHaveBeenCalledWith(
        mockInteraction,
        mockUser,
        "user.userNotExist"
      );
      expect(CalculeBalanceLogic).toHaveBeenCalledWith(
        mockUser,
        expect.any(Number)
      );
      expect(LootLogic).toHaveBeenCalledWith([
        { chance: 1, reward: 1000 },
        { chance: 100, reward: expect.any(Function) },
      ]);
      expect(isDailyAlreadyClaimed).toHaveBeenCalledWith(
        mockInteraction,
        expect.any(Date),
        mockUser,
        "daily.dailyAlreadyClaimed"
      );
      expect(mockSave).toHaveBeenCalled();
      expect(createDailyEmbed).toHaveBeenCalledWith(
        mockInteraction,
        mockGuild,
        expect.any(String),
        expect.any(String),
        expect.any(String)
      );
      expect(wrapInteraction).toHaveBeenCalledWith(
        mockInteraction,
        expect.any(Function)
      );
    });

    test("deve atualizar balance do usuário corretamente", async () => {
      await command.execute(mockInteraction);

      expect(mockUser.balance).toBeDefined();
      expect(mockUser.lastDaily).toBeInstanceOf(Date);
    });

    test("deve chamar todas as traduções necessárias", async () => {
      await command.execute(mockInteraction);

      expect(translate).toHaveBeenCalledWith("pt", "guild.guildInNotGuild");
      expect(translate).toHaveBeenCalledWith("pt", "guild.guildNotExist");
      expect(translate).toHaveBeenCalledWith("pt", "user.userNotExist");
      expect(translate).toHaveBeenCalledWith("pt", "daily.dailyAlreadyClaimed");
      expect(translate).toHaveBeenCalledTimes(4);
    });
  });

  describe("❌ Cenários de Erro - Guild Verification", () => {
    test("deve parar execução quando usuário não está em uma guild", async () => {
      isInNotGuild.mockResolvedValue(true);

      await command.execute(mockInteraction);

      expect(isInNotGuild).toHaveBeenCalledWith(
        mockInteraction,
        "guild.guildInNotGuild"
      );
      expect(Guild.findOne).not.toHaveBeenCalled();
      expect(User.findOne).not.toHaveBeenCalled();
      expect(mockSave).not.toHaveBeenCalled();
      expect(wrapInteraction).not.toHaveBeenCalled();
    });

    test("deve parar execução quando guild não existe no banco", async () => {
      isGuildNotExist.mockResolvedValue(true);

      await command.execute(mockInteraction);

      expect(isInNotGuild).toHaveBeenCalled();
      expect(Guild.findOne).toHaveBeenCalled();
      expect(isGuildNotExist).toHaveBeenCalledWith(
        mockInteraction,
        mockGuild,
        "guild.guildNotExist"
      );
      expect(User.findOne).not.toHaveBeenCalled();
      expect(mockSave).not.toHaveBeenCalled();
      expect(wrapInteraction).not.toHaveBeenCalled();
    });
  });

  describe("❌ Cenários de Erro - User Verification", () => {
    test("deve parar execução quando usuário não existe", async () => {
      isUserNotExist.mockResolvedValue(true);

      await command.execute(mockInteraction);

      expect(isInNotGuild).toHaveBeenCalled();
      expect(Guild.findOne).toHaveBeenCalled();
      expect(isGuildNotExist).toHaveBeenCalled();
      expect(User.findOne).toHaveBeenCalled();
      expect(isUserNotExist).toHaveBeenCalledWith(
        mockInteraction,
        mockUser,
        "user.userNotExist"
      );
      expect(CalculeBalanceLogic).not.toHaveBeenCalled();
      expect(mockSave).not.toHaveBeenCalled();
      expect(wrapInteraction).not.toHaveBeenCalled();
    });
  });

  describe("❌ Cenários de Erro - Daily Verification", () => {
    test("deve parar execução quando daily já foi reclamado", async () => {
      isDailyAlreadyClaimed.mockResolvedValue(true);

      await command.execute(mockInteraction);

      expect(isInNotGuild).toHaveBeenCalled();
      expect(Guild.findOne).toHaveBeenCalled();
      expect(isGuildNotExist).toHaveBeenCalled();
      expect(User.findOne).toHaveBeenCalled();
      expect(isUserNotExist).toHaveBeenCalled();
      expect(CalculeBalanceLogic).toHaveBeenCalled();
      expect(LootLogic).toHaveBeenCalled();
      expect(isDailyAlreadyClaimed).toHaveBeenCalledWith(
        mockInteraction,
        expect.any(Date),
        mockUser,
        "daily.dailyAlreadyClaimed"
      );
      expect(mockSave).not.toHaveBeenCalled();
      expect(wrapInteraction).not.toHaveBeenCalled();
    });
  });

  describe("🔧 Verificações de Configuração", () => {
    test("deve ter configuração correta do comando", () => {
      expect(command.data.name).toBe("daily");
      expect(command.data.description).toBe("Receba o premio diario");
      expect(command.cooldown).toBe(5);
    });

    test("deve ter método execute definido", () => {
      expect(command.execute).toBeDefined();
      expect(typeof command.execute).toBe("function");
    });
  });

  describe("🧪 Testes de Integração - Fluxo Completo", () => {
    test("deve executar todas as verificações na ordem correta para cenário de sucesso", async () => {
      await command.execute(mockInteraction);

      expect(isInNotGuild).toHaveBeenCalledBefore(Guild.findOne);
      expect(Guild.findOne).toHaveBeenCalledBefore(isGuildNotExist);
      expect(isGuildNotExist).toHaveBeenCalledBefore(User.findOne);
      expect(User.findOne).toHaveBeenCalledBefore(isUserNotExist);
      expect(isUserNotExist).toHaveBeenCalledBefore(LootLogic);
      expect(LootLogic).toHaveBeenCalledBefore(CalculeBalanceLogic);
      expect(CalculeBalanceLogic).toHaveBeenCalledBefore(isDailyAlreadyClaimed);
      expect(isDailyAlreadyClaimed).toHaveBeenCalledBefore(mockSave);
      expect(mockSave).toHaveBeenCalledBefore(createDailyEmbed);
      expect(createDailyEmbed).toHaveBeenCalledBefore(wrapInteraction);
    });

    test("deve limpar todos os mocks entre testes", () => {
      expect(isInNotGuild).not.toHaveBeenCalled();
      expect(Guild.findOne).not.toHaveBeenCalled();
      expect(User.findOne).not.toHaveBeenCalled();
      expect(mockSave).not.toHaveBeenCalled();
    });
  });

  describe("📊 Testes de Lógica de Negócio", () => {
    test("deve calcular balance com reward aleatório entre 0-500", async () => {
      await command.execute(mockInteraction);

      const lootCall = LootLogic.mock.calls[0][0];
      const randomRewardFn = lootCall[1].reward;
      const reward = randomRewardFn();

      expect(reward).toBeGreaterThanOrEqual(0);
      expect(reward).toBeLessThanOrEqual(500);
    });

    test("deve ter chance de 1% para reward de 1000", async () => {
      await command.execute(mockInteraction);

      const lootCall = LootLogic.mock.calls[0][0];
      expect(lootCall[0]).toEqual({ chance: 1, reward: 1000 });
    });

    test("deve ter chance de 100% para reward aleatório", async () => {
      await command.execute(mockInteraction);

      const lootCall = LootLogic.mock.calls[0][0];
      expect(lootCall[1].chance).toBe(100);
      expect(typeof lootCall[1].reward).toBe("function");
    });
  });
});
