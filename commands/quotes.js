import { Low, JSONFile } from "lowdb";
const { SlashCommandBuilder } = await import("@discordjs/builders");
const { EmbedBuilder, hyperlink, hideLinkEmbed } = await import('discord.js');
const path = await import("node:path");
const fs = await import("node:fs");
import { fileURLToPath } from "url";
import { Quote } from "../libs/quoteslib.mjs"


export default {

  
  data: new SlashCommandBuilder()
    .setName("quote")
    .setDescription("Quote command")
    .addSubcommand(subcommand =>
		subcommand
			.setName('add')
			.setDescription('adds quote')
        .addStringOption(option => option.setName('subject').setDescription('The person who said the quote'))
        .addStringOption(option => option.setName('content').setDescription('The content of the quote')))
  .addSubcommand(subcommand =>
		subcommand
			.setName('get')
			.setDescription('get quote')
      .addIntegerOption(option => option.setName('subject').setDescription('The person who said the quote')
      .setRequired(false))
  ),
  async execute(interaction) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const file = path.join(__dirname, "/../quotes.json");
    const adapter = new JSONFile(file);
    const db = new Low(adapter);
    await db.read();
    const nicks = db.data.nicknames;
    let quote = Quote.getRandomQuote();
    const subject = nicks[quote.subject] ? nicks[quote.subject] : quote.subject;
    const author = nicks[quote.author] ? nicks[quote.author] : quote.author;

    const getNum = interaction.options.getInteger('get');

    if (getNum) {
      quote = Quote.getQuoteById(getNum - 1);
    }
    const quoteEmbed = new EmbedBuilder()
      .setURL(quote.link)
      .setDescription(`<${subject}> ${quote.content}`)
      .setFooter({ text: hyperlink(`quoted by ${author} at ${quote.date}`, quote.link)});
    interaction.reply({ embeds: [quoteEmbed] });
  },
};
