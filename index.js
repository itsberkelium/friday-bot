const fs = require("fs");
const dotenv = require("dotenv").config();
const { Client, Intents, Collection } = require("discord.js");
const API = require("./API.js");

const client = new Client({ intents: [Intents.FLAGS.GUILD_MESSAGES] });

const prefix = "!cumali";
const trigger = "hayırlı cumalar";

client.commands = new Collection();

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on("ready", () => {
  console.log(`Ready to roll as ${client.user.tag}`);
});

client.on("messageCreate", function (message) {
  console.log(message.content);
  if (message.author.bot) return;

  if (message.content.trim().toLocaleLowerCase().indexOf(trigger)) {
    return message.channel.send(
      `${message.author.username} hayırlı cumalar kardeşim!`
    );
  }

  if (!message.content.startsWith(prefix)) return;
});

client.login(process.env.BOT_TOKEN);
