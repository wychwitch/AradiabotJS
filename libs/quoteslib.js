import { Low, JSONFile } from "lowdb";
const { SlashCommandBuilder } = await import("@discordjs/builders");
const path = await import("node:path");
const fs = await import("node:fs");
import { fileURLToPath } from "url";
import moment from 'moment';
import { DateTime } from "luxon";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, "/../quotes.json");
const adapter = new JSONFile(file);
const db = new Low(adapter);
await db.read();
const quotes = db.data.quotesList;
const nicks = db.data.nicknames;


class Quotes {
    getRandomQuote() {
        return quotes[Math.floor(Math.random() * items.length)];
    }
    getRandomQuoteList(amount) {
        let quoteList = [];
        for (let i; i < amount; i++){
            quoteList.append(this.getRandomQuote());
        }
        return quoteList;
    }
    async addQuote(quoteSubj, quoteContent, quoteAuth) {
        await db.read();
        let quoteEntry = {
            content: quoteContent,
            subject: quoteSubj,
            author: quoteAuth,
            date: DateTime.now().toLocaleString()
        }
        quotes.append(quoteEntry);
        await db.write();
    }

}