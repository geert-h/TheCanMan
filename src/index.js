require("dotenv").config();
const { Client, IntentsBitField, EmbedBuilder } = require("discord.js");
const { OpenAI } = require("openai");
const { commands } = require("./register-commands.js");

const openai = new OpenAI({ apiKey: process.env.OPENAI_TOKEN });

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", (c) => {
  console.log(`✅ ${c.user.tag} is online`);
});

client.on("messageCreate", (message) => {
  console.log(message);

  const validServer = validServerCheck(message.guildId);

  if (!validServer) return;

  if (message.author.bot) return;

  if (
    message.content.startsWith(`<@${client.user.id}>`) ||
    message.content.startsWith(`<@!${client.user.id}>`)
  ) {
    message.reply(
      message.content.substr(message.content.indexOf(" ") + 1) + "!"
    );
  }

  if (message.content === "hello") {
    message.reply("Hey!");
  }

  if (message.content === "who-am-i") {
    const embed = new EmbedBuilder()
      .setTitle("The Can Man")
      .setDescription("This is the description")
      .setColor("Random")
      .addFields(
        {
          name: "Find me on GitHub",
          value: "Some random value",
          inline: true,
        },
        {
          name: "Second Field title",
          value: "Some random value",
          inline: true,
        }
      );

    message.channel.send({ embeds: [embed] });
  }
});

async function getResponseFromAPI(content) {
  // const completion = await openai.chat.completions.create({
  //   messages: [{ role: "system", content: `${content}` }],
  //   model: "gpt-3.5-turbo",
  // });
  // console.log(completion.choices[0]);
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Who won the world series in 2020?" },
        {
          role: "assistant",
          content: "The Los Angeles Dodgers won the World Series in 2020.",
        },
        { role: "user", content: "Where was it played?" },
      ],
      model: "gpt-3.5-turbo",
    });

    console.log(completion.choices[0]);
  } catch (error) {
    console.log(`${error}`);
  }
}

function validServerCheck(givenChannelId) {
  return givenChannelId === process.env.GUILD_ID;
}

client.on("interactionCreate", (interaction) => {
  if (!validServerCheck(interaction.guildId)) return;

  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    interaction.reply("Pong!");
  }

  if (interaction.commandName === "add") {
    const num1 = interaction.options.get("first-number").value;
    const num2 = interaction.options.get("second-number").value;

    interaction.reply(`The sum is ${num1 + num2}`);
  }

  if (interaction.commandName === "embed") {
    const embed = new EmbedBuilder()
      .setTitle("Embed title")
      .setDescription("This is the description")
      .setColor("Random")
      .addFields(
        {
          name: "Field title",
          value: "Some random value",
          inline: true,
        },
        {
          name: "Second Field title",
          value: "Some random value",
          inline: true,
        }
      );

    interaction.reply({ embeds: [embed] });
  }
});

client.login(process.env.TOKEN);
