const interaction = {
  user: jest.fn().mockReturnValue({ id: "123", username: "TestUser" }),
  guild: jest.fn().mockReturnValue({ id: "456", name: "TestGuild" }),
  reply: jest.fn(),
  editReply: jest.fn(),
  deferReply: jest.fn(),
};
