const wrapInteraction = jest
  .fn()
  .mockImplementation(async (interaction, callBack) => {
    await callBack(interaction);
  });
