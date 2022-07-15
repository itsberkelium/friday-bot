const http = require("http");
const fs = require("fs");
const dotenv = require("dotenv").config();
const { Client, Intents, Collection } = require("discord.js");
const API = require("./API.js");
const falseResponses = require("./db/falseResponses.js");
const trueResponses = require("./db/trueResponses.js");

let servers = {};

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
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

client.on("ready", async () => {
  console.log(`Ready to roll as ${client.user.tag}`);

  client.guilds.cache.forEach(async (guild) => {
    servers[guild.id] = {
      members: [],
      name: guild.name,
      id: guild.id,
    };

    guild.members
      .fetch()
      .then((members) => {
        members
          .filter((member) => !member.user.bot)
          .forEach(async (member) => {
            servers[guild.id].members.push({
              id: member.user.id,
              name: member.user.username,
            });
          });
      })
      .finally(() => {
        console.log(servers);
      });
  });
});

client.on("messageCreate", function (message) {
  if (message.author.bot) return;

  if (message.content.trim().toUpperCase().indexOf(trigger) > -1) {
    const dayName = new Date().toLocaleString("en-us", { weekday: "long" });

    if (dayName === "Friday")
      return message.reply(
        trueResponses[Math.floor(Math.random() * trueResponses.length)].replace(
          ":user",
          message.author
        )
      );
    else
      return message.reply(
        falseResponses[
          Math.floor(Math.random() * falseResponses.length)
        ].replace(":user", message.author)
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
