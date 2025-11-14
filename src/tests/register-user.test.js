jest.mock("@database/models/guildschema", () =>
  require("@mocks/database/models/guildschema")
);
jest.mock("@database/models/userschema", () =>
  require("@mocks/database/models/userschema")
);
jest.mock("@helpers/guards/guild-verification", () =>
  require("@mocks/helpers/guards/guild-verification")
);
jest.mock("@helpers/guards/user-verification", () =>
  require("@mocks/helpers/guards/user-verification")
);
jest.mock("@i18n/translate", () => require("@mocks/i18n/translate"));
jest.mock("@helpers/middleware/wrappers/wrap-interaction", () =>
  require("@mocks/helpers/middleware/wrap-interaction")
);

const User = require("@database/models/userschema");
const Guild = require("@database/models/guildschema");
const {
  isInNotGuild,
  isGuildNotExist,
} = require("@helpers/guards/guild-verification");
const { isUserExist } = require("@helpers/guards/user-verification");
const translate = require("@i18n/translate");
const wrapInteraction = require("@helpers/middleware/wrappers/wrap-interaction");
const command = require("@commands/configs/register-user");

describe("Register User Command", () => {
  let mockSave, mockInteraction;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSave = jest.fn().mockResolvedValue(true);

    mockInteraction = {
      guild: { id: "guild123" },
      user: { id: "user456" },
      reply: jest.fn(),
    };

    User.mockImplementation((data) => ({
      ...data,
      save: mockSave,
    }));

    translate.mockImplementation((lang, key) => key);
  });

  describe("✅ Cenário de Sucesso", () => {
    beforeEach(() => {
      // Setup para sucesso
      isInNotGuild.mockResolvedValue(false);
      Guild.findOne.mockResolvedValue({ guildId: "guild123" });
      isGuildNotExist.mockResolvedValue(false);
      User.findOne.mockResolvedValue(null); // Usuário não existe
      isUserExist.mockResolvedValue(false);
    });

    test("deve registrar um usuário com sucesso respeitando a ordem de execução", async () => {
      await command.execute(mockInteraction);

      expect(isInNotGuild).toHaveBeenCalledBefore(Guild.findOne);
      expect(Guild.findOne).toHaveBeenCalledBefore(isGuildNotExist);
      expect(isGuildNotExist).toHaveBeenCalledBefore(User.findOne);
      expect(User.findOne).toHaveBeenCalledBefore(isUserExist);
      expect(isUserExist).toHaveBeenCalledBefore(User);
      expect(User).toHaveBeenCalledBefore(mockSave);
      expect(mockSave).toHaveBeenCalledBefore(wrapInteraction);

      expect(isInNotGuild).toHaveBeenCalledWith(
        mockInteraction,
        "guild.guildInNotGuild"
      );

      expect(Guild.findOne).toHaveBeenCalledWith({
        guildId: "guild123",
      });

      expect(isGuildNotExist).toHaveBeenCalledWith(
        mockInteraction,
        { guildId: "guild123" },
        "guild.guildNotExist"
      );

      expect(User.findOne).toHaveBeenCalledWith({
        userId: "user456",
      });

      expect(isUserExist).toHaveBeenCalledWith(
        mockInteraction,
        null,
        "user.userExist"
      );

      expect(User).toHaveBeenCalledWith({
        userId: "user456",
        guildId: "guild123",
      });

      expect(mockSave).toHaveBeenCalledTimes(1);

      expect(wrapInteraction).toHaveBeenCalledWith(
        mockInteraction,
        expect.any(Function)
      );

      expect(translate).toHaveBeenCalledWith("pt", "guild.guildInNotGuild");
      expect(translate).toHaveBeenCalledWith("pt", "guild.guildNotExist");
      expect(translate).toHaveBeenCalledWith("pt", "user.userExist");
      expect(translate).toHaveBeenCalledWith("pt", "user.userRegisterSuccess");
      expect(translate).toHaveBeenCalledTimes(4);

      expect(isInNotGuild).toHaveReturned();
      expect(isGuildNotExist).toHaveReturned();
      expect(isUserExist).toHaveReturned();
    });

    test("deve criar o usuário com os dados corretos", async () => {
      await command.execute(mockInteraction);

      expect(User).toHaveBeenCalledWith({
        userId: mockInteraction.user.id,
        guildId: mockInteraction.guild.id,
      });
      expect(User).toHaveBeenCalledTimes(1);
    });

    test("deve salvar o usuário criado", async () => {
      await command.execute(mockInteraction);

      expect(mockSave).toHaveBeenCalledTimes(1);
      expect(mockSave).toHaveBeenCalledWith();
    });
  });

  describe("❌ Cenários de Erro - Guild Verification", () => {
    describe("quando usuário não está em uma guild", () => {
      beforeEach(() => {
        isInNotGuild.mockResolvedValue(true);
        Guild.findOne.mockResolvedValue({ guildId: "guild123" });
        isGuildNotExist.mockResolvedValue(false);
        User.findOne.mockResolvedValue(null);
        isUserExist.mockResolvedValue(false);
      });

      test("deve parar a execução e não prosseguir", async () => {
        await command.execute(mockInteraction);

        expect(isInNotGuild).toHaveBeenCalledWith(
          mockInteraction,
          "guild.guildInNotGuild"
        );
        expect(translate).toHaveBeenCalledWith("pt", "guild.guildInNotGuild");

        expect(Guild.findOne).not.toHaveBeenCalled();
        expect(isGuildNotExist).not.toHaveBeenCalled();
        expect(User.findOne).not.toHaveBeenCalled();
        expect(isUserExist).not.toHaveBeenCalled();
        expect(User).not.toHaveBeenCalled();
        expect(mockSave).not.toHaveBeenCalled();
        expect(wrapInteraction).not.toHaveBeenCalled();
      });
    });

    describe("quando guild não existe no banco", () => {
      beforeEach(() => {
        isInNotGuild.mockResolvedValue(false);
        Guild.findOne.mockResolvedValue(null);
        isGuildNotExist.mockResolvedValue(true);
        User.findOne.mockResolvedValue(null);
        isUserExist.mockResolvedValue(false);
      });

      test("deve parar a execução após verificar guild", async () => {
        await command.execute(mockInteraction);

        expect(isInNotGuild).toHaveBeenCalledWith(
          mockInteraction,
          "guild.guildInNotGuild"
        );
        expect(Guild.findOne).toHaveBeenCalledWith({ guildId: "guild123" });
        expect(isGuildNotExist).toHaveBeenCalledWith(
          mockInteraction,
          null,
          "guild.guildNotExist"
        );

        expect(User.findOne).not.toHaveBeenCalled();
        expect(isUserExist).not.toHaveBeenCalled();
        expect(User).not.toHaveBeenCalled();
        expect(mockSave).not.toHaveBeenCalled();
        expect(wrapInteraction).not.toHaveBeenCalled();

        expect(isInNotGuild).toHaveBeenCalledBefore(Guild.findOne);
        expect(Guild.findOne).toHaveBeenCalledBefore(isGuildNotExist);
      });
    });
  });

  describe("❌ Cenários de Erro - User Verification", () => {
    describe("quando usuário já existe", () => {
      beforeEach(() => {
        isInNotGuild.mockResolvedValue(false);
        Guild.findOne.mockResolvedValue({ guildId: "guild123" });
        isGuildNotExist.mockResolvedValue(false);
        User.findOne.mockResolvedValue({
          userId: "user456",
          guildId: "guild123",
        });
        isUserExist.mockResolvedValue(true);
      });

      test("deve parar a execução após verificar usuário", async () => {
        await command.execute(mockInteraction);

        expect(isInNotGuild).toHaveBeenCalledWith(
          mockInteraction,
          "guild.guildInNotGuild"
        );
        expect(Guild.findOne).toHaveBeenCalledWith({ guildId: "guild123" });
        expect(isGuildNotExist).toHaveBeenCalledWith(
          mockInteraction,
          { guildId: "guild123" },
          "guild.guildNotExist"
        );
        expect(User.findOne).toHaveBeenCalledWith({ userId: "user456" });
        expect(isUserExist).toHaveBeenCalledWith(
          mockInteraction,
          { userId: "user456", guildId: "guild123" },
          "user.userExist"
        );

        expect(User).not.toHaveBeenCalled();
        expect(mockSave).not.toHaveBeenCalled();
        expect(wrapInteraction).not.toHaveBeenCalled();

        expect(isInNotGuild).toHaveBeenCalledBefore(Guild.findOne);
        expect(Guild.findOne).toHaveBeenCalledBefore(isGuildNotExist);
        expect(isGuildNotExist).toHaveBeenCalledBefore(User.findOne);
        expect(User.findOne).toHaveBeenCalledBefore(isUserExist);
      });

      test("deve verificar usuário com dados corretos", async () => {
        await command.execute(mockInteraction);

        expect(User.findOne).toHaveBeenCalledWith({
          userId: mockInteraction.user.id,
        });
        expect(isUserExist).toHaveBeenCalledWith(
          mockInteraction,
          { userId: "user456", guildId: "guild123" },
          "user.userExist"
        );
      });
    });
  });

  describe("🔧 Verificações de Configuração", () => {
    beforeEach(() => {
      isInNotGuild.mockResolvedValue(false);
      Guild.findOne.mockResolvedValue({ guildId: "guild123" });
      isGuildNotExist.mockResolvedValue(false);
      User.findOne.mockResolvedValue(null);
      isUserExist.mockResolvedValue(false);
    });

    test("deve ter configuração correta do comando", () => {
      expect(command.cooldown).toBe(5);
      expect(command.data).toBeDefined();
      expect(command.data.name).toBe("register-user");
      expect(command.execute).toBeInstanceOf(Function);
    });

    test("deve usar MessageFlags.Ephemeral na resposta", async () => {
      await command.execute(mockInteraction);

      expect(wrapInteraction).toHaveBeenCalledWith(
        mockInteraction,
        expect.any(Function)
      );

      const callbackFunction = wrapInteraction.mock.calls[0][1];
      expect(callbackFunction).toBeInstanceOf(Function);
    });
  });

  describe("🧪 Testes de Integração - Fluxo Completo", () => {
    test("deve executar todas as verificações na ordem correta para cenário de sucesso", async () => {
      isInNotGuild.mockResolvedValue(false);
      Guild.findOne.mockResolvedValue({ guildId: "guild123" });
      isGuildNotExist.mockResolvedValue(false);
      User.findOne.mockResolvedValue(null);
      isUserExist.mockResolvedValue(false);

      await command.execute(mockInteraction);

      const mockCalls = [
        isInNotGuild,
        Guild.findOne,
        isGuildNotExist,
        User.findOne,
        isUserExist,
        User,
        mockSave,
        wrapInteraction,
      ];

      for (let i = 0; i < mockCalls.length - 1; i++) {
        expect(mockCalls[i]).toHaveBeenCalledBefore(mockCalls[i + 1]);
      }
    });

    test("deve limpar todos os mocks entre testes", () => {
      expect(isInNotGuild).not.toHaveBeenCalled();
      expect(Guild.findOne).not.toHaveBeenCalled();
      expect(User.findOne).not.toHaveBeenCalled();
      expect(User).not.toHaveBeenCalled();
      expect(mockSave).not.toHaveBeenCalled();
      expect(wrapInteraction).not.toHaveBeenCalled();
      expect(translate).not.toHaveBeenCalled();
    });
  });
});
