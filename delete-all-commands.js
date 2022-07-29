import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
const data = await import('./config.json', {
  assert: { type: 'json' }
});
const { clientId, guildId, token } = data.default;

const rest = new REST({ version: "9" }).setToken(token);

// ...

// for guild-based commands
rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
  .then(() => console.log("Successfully deleted all guild commands."))
  .catch(console.error);

// for global commands
rest
  .put(Routes.applicationCommands(clientId), { body: [] })
  .then(() => console.log("Successfully deleted all application commands."))
  .catch(console.error);
