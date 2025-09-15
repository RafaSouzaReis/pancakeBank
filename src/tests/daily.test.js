jest.mock("../services/export");
const mockEmbedBuilder = require("./utils/mockEmbed");
jest.mock("discord.js", () => ({
  EmbedBuilder: jest.fn(() => mockEmbedBuilder()),
}));

const {
  isInNotGuild,
  isDailyAlreadyClaimed,
  UserExist,
  isGuildExist,
} = require("../services/export");
const mockInteraction = require("./utils/mock-interaction");
const { EmbedBuilder } = require("discord.js");

const command = require("../commands/money/daily");

describe("/daily", () => {
  beforeAll(() => {
    jest.clearAllMocks();
    isInNotGuild.mockResolvedValue(true);
    isDailyAlreadyClaimed.mockResolvedValue(false);
    UserExist.mockResolvedValue(true);
    isGuildExist.mockResolvedValue(true);
  });

  describe("Fluxo Principal", () => {
    test("Deve retornar com exito sem erro.", async () => {
      await command.execute(mockInteraction);
      expect(isInNotGuild).toHaveBeenCalledWith(mockInteraction);
      expect(isGuildExist).toHaveBeenLastCalledWith(mockInteraction);
      expect(UserExist).toHaveBeenCalledWith(mockInteraction);
      expect(isDailyAlreadyClaimed).toHaveBeenCalledWith(mockInteraction);
    });
  });
});
