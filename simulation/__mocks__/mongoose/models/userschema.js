const User = jest.fn().mockImplementation((data) => {
  return {
    ...data,
    save: jest.fn().mockResolvedValue(true),
  };
});

module.exports = User;
