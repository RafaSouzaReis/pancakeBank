import { MessageFlags } from "discord.js";
const User = require("../../database/models/userschema");
const Guild = require("../../database/models/guildschema");
const {
  isInNotGuild,
  isGuildNotExist,
} = require("../../helpers/guards/guild-verification");
const { isUserExist } = require("../../helpers/guards/user-verification");
const translate = require("../../i18n/translate");
const wrapInteraction = require("../../helpers/middleware/wrappers/wrap-interaction");

describe("register-user command", () => {
  test("User registration successful", async () => {});
});
