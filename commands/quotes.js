import { Low, JSONFile } from "lowdb";
const { SlashCommandBuilder } = await import("@discordjs/builders");
const path = await import("node:path");
const fs = await import("node:fs");
import { fileURLToPath } from "url";

export default {
  data: new SlashCommandBuilder()
    .setName("quote")
    .setDescription("Quote command"),
  async execute(interaction) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const file = path.join(__dirname, "/../quotes.json");
    const adapter = new JSONFile(file);
    const db = new Low(adapter);
    await db.read();
    const quotes = db.data.quotesList;
    const nicks = db.data.nicknames;
    if (quotes) {
      await interaction.reply(
        `${quotes[0].content} \n\n${quotes[0].date} with the following message: \n \n "${quotes[0].message}"`
      );
    } else {
      await interaction.reply("You have no balls, good sir.");
    }
  },
};
