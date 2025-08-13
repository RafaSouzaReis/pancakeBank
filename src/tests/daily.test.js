jest.mock("../services/export");
const mockEmbedBuilder = require("./utils/mockEmbed");
jest.mock("discord.js", () => ({
  EmbedBuilder: jest.fn(() => mockEmbedBuilder()),
}));

const {
  InGuild,
  AlreadyClaimed,
  UserExist,
  GuildExist,
} = require("../services/export");
const mockInteraction = require("./utils/mock-interaction");
const { EmbedBuilder } = require("discord.js");

const command = require("../commands/money/daily");

describe("/daily", () => {
  beforeAll(() => {
    jest.clearAllMocks();
    InGuild.mockResolvedValue(true);
    AlreadyClaimed.mockResolvedValue(false);
    UserExist.mockResolvedValue(true);
    GuildExist.mockResolvedValue(true);
  });

  describe("Fluxo Principal", () => {
    test("Deve retornar com exito sem erro.", async () => {
      await command.execute(mockInteraction);
      expect(InGuild).toHaveBeenCalledWith(mockInteraction);
      expect(GuildExist).toHaveBeenLastCalledWith(mockInteraction);
      expect(UserExist).toHaveBeenCalledWith(mockInteraction);
      expect(AlreadyClaimed).toHaveBeenCalledWith(mockInteraction);
    });
  });
});
