globalThis.fs = require("fs");
globalThis.discord = require("discord.js");
globalThis.client = new discord.Client({
  intents: 5633,
  partials: [
    discord.Partials.Channel,
    discord.Partials.Message,
    discord.Partials.Reaction,
    discord.Partials.User,
  ],
  ws: {
    properties: {
      browser: "Discord Android",
    },
  },
  presence: { status: "online" }
  ,
});
globalThis.config = require("./config.json");
globalThis.commands = new discord.Collection();
globalThis.contexts = new discord.Collection();
module.exports = new Map();






fs.readdirSync("./events/", { encoding: "utf8" }).forEach((dir) => {
  const events = fs
    .readdirSync(`./events/${dir}`)
    .filter((file) => file.endsWith(".js"));

  for (let file of events) {
    require(`./events/${dir}/${file}`);
    console.log(`Olay yüklendi: ${dir}/${file}`);
    continue;
  }
});
fs.readdirSync("./commands/", { encoding: "utf8" }).forEach((dir) => {
  const cmdFiles = fs
    .readdirSync(`./commands/${dir}`)
    .filter((file) => file.endsWith(".js"));

  for (let file of cmdFiles) {
    const command = require(`./commands/${dir}/${file}`);
    if (command.slashData) {
      console.log(`Komut yüklendi: ${command.slashData.name} (${dir}/${file})`);
      commands.set(command.slashData.name, command);
    }
    if (command.contextData) {
      console.log(
        `Context yüklendi: ${command.contextData.name} (${dir}/${file})`
      );
      contexts.set(command.contextData.name, command);
    }
    continue;
  }
});

client.login(config.token);
