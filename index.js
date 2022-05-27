const fs = require("fs");
const dotenv = require("dotenv").config();
const { Client, Intents, Collection } = require("discord.js");
const API = require("./API.js");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const randomFalseMessages = [
  "Ooo kardeşim, cuma kalabalık olur diye erkenden mi gittin sen?",
  "Senin yüzünden cumayı kaçırdım sandım.",
  "Daha gelmedik. Sen yat ben uyandırırım seni.",
  "Ah keşke bee...",
  "Ben de isterdim gavurlar gibi Allah'a Şükür Bugün Cuma demeyi.",
  "Güneş batarken ardından tepelerin... Neyse...",
  "Bugün cuma mı mübaret?",
  "Sabret kardeşim, o günler de gelecek.",
];

const prefix = "!cumali";
const trigger = "HAYIRLI CUMALAR";

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
        randomFalseMessages[
          Math.floor(Math.random() * randomFalseMessages.length)
        ]
      );
  }

  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length + 1);
  const args = commandBody.split(" ");
  const commandName = args.shift().toLowerCase();

  if (commandName === "ping") {
    const timeTaken = Date.now() - message.createdTimestamp;
    message.reply(`Pong! This message had a latency of ${timeTaken}ms!`);
  }

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
