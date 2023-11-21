require("dotenv").config();
const { REST, Routes, ApplicationCommandOptionType } = require("discord.js");

const commands = [
  {
    name: "add",
    description: "Adds two numbers.",
    options: [
      {
        name: "first-number",
        description: "The first number",
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
      {
        name: "second-number",
        description: "The second number",
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
    ],
  },
  {
    name: "hey",
    description: "Replies with hey!",
  },
  {
    name: "ping",
    description: "pong!",
  },
  {
    name: "embed",
    description: "Sends an embed!",
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Registering slash commands...");
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log("slash commands were registered succesfully.");
  } catch (error) {
    console.log(
      `There was an error while registering the slash commands: ${error}`
    );
  }
})();
