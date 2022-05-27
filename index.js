import fs from "fs";
import dotenv from "dotenv";
import Discord from "discord.js";
import API from "./API";

const client = new Discord.Client();

const prefix = "!cumali";
const trigger = "hayırlı cumalar";

client.commands = new Discord.Collection();

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
  if (message.author.bot) return;

  if (message.content.trim().toLocaleLowerCase().indexOf(trigger)) {
    return message.channel.send(
      `${message.author.username} hayırlı cumalar kardeşim!`
    );
  }

  if (!message.content.startsWith(prefix)) return;
});

client.login(process.env.BOT_TOKEN);
