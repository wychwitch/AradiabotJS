const { SlashCommandBuilder } = await import("@discordjs/builders");

export default {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Replies with server info!"),
  async execute(interaction) {
    await interaction.reply(
      `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
    );
  },
};
