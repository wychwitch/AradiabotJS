// Require the necessary discord.js classes
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { token } = require("./config.json");
import { Low, JSONFile } from "lowdb";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, "db.json");
const adapter = new JSONFile(file);
const db = new Low(adapter);

db.data ||= { balls: [] };

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Ready!");
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = await import(filePath);
  // Set a new item in the Collection
  // With the key as the command name and the value as the exported module
  client.commands.set(command.default.data.name, command);
}

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // handle messages in a guild
  if (message.guild) {
    if (message.content.includes("balls")) {
      await db.read();
      db.data[message.author.id] = {
        id: message.author.id,
        author: message.author,
        date: message.createdTimestamp,
        channel: message.channel,
        message: message.content,
      };
      await db.write();

      console.log("saved balls");

      await db.read();
    }
    //console.log(message.content);
  }
});

client.on("interactionCreate", async (interaction) => {
  const command = client.commands.get(interaction.commandName).default;

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content:
        "There was an error while executing this command! Complain to chair about it",
      ephemeral: true,
    });
  }
});

// Login to Discord with your client's token
client.login(token);
