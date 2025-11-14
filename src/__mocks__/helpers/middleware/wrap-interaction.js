module.exports = jest.fn().mockImplementation(async (interaction, callBack) => {
  await callBack(interaction);
});
