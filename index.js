const http = require("http");
const fs = require("fs");
const dotenv = require("dotenv").config();
const { Client, Intents, Collection } = require("discord.js");
const API = require("./API.js");
const falseResponses = require("./falseResponses.js");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const prefix = "!cumali";
const trigger = "HAYIRLI CUMA";

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
  if (message.author.bot) return;

  if (message.content.trim().toUpperCase().indexOf(trigger) > -1) {
    const dayName = new Date().toLocaleString("en-us", { weekday: "long" });

    if (dayName === "Friday")
      return message.reply(`${message.author} hayırlı cumalar kardeşim!`);
    else
      return message.reply(
        falseResponses[Math.floor(Math.random() * falseResponses.length)]
      );
  }

  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length + 1);
  const args = commandBody.split(" ");
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  if (command.args && !args.length) {
    return message.channel.send(`Eksik komut gönderdin, ${message.author}!`);
  }

  try {
    command.execute(message, args, prefix);
  } catch (error) {
    console.error(error);
    message.reply("Bu komutu çalıştırırken hata oluştu!");
  }
});

client.login(process.env.BOT_TOKEN);

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  res.end("<h1>Hello World</h1>");
});

server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
