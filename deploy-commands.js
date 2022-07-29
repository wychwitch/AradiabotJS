const fs = await import("node:fs");
const path = await import("node:path");
const { SlashCommandBuilder } = await import("@discordjs/builders");
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { fileURLToPath } from "url";
const data = await import('./config.json', {
  assert: { type: 'json' }
});
const { clientId, guildId, token } = data.default;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const commands = [];
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js") || file.endsWith(".mjs"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = await import(filePath);
  commands.push(command.default.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(token);

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() =>
    console.log("\x1b[32m", "Successfully registered application commands.")
  )
  .catch(console.error);
