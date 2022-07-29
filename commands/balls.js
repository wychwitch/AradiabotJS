import { Low, JSONFile } from "lowdb";
const { SlashCommandBuilder } = await import("@discordjs/builders");
const path = await import("node:path");
const fs = await import("node:fs");
import { fileURLToPath } from "url";

export default {
  data: new SlashCommandBuilder()
    .setName("balls")
    .setDescription("Replies with the last time the user said balls"),
  async execute(interaction) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const file = path.join(__dirname, "/../db.json");
    const adapter = new JSONFile(file);
    const db = new Low(adapter);
    await db.read();
    const ballsObj = db.data[interaction.user.id];
    if (ballsObj) {
      await interaction.reply(
        `You last said 'balls' in ${ballsObj.channel.name} at ${ballsObj.date} with the following message: \n \n "${ballsObj.message}"`
      );
    } else {
      await interaction.reply("You have no balls, good sir.");
    }
  },
};
