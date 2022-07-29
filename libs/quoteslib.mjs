import { Low, JSONFile } from "lowdb";
const { SlashCommandBuilder } = await import("@discordjs/builders");
const path = await import("node:path");
const fs = await import("node:fs");
import { fileURLToPath } from "url";
import { DateTime } from "luxon";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, "/../quotes.json");
const adapter = new JSONFile(file);
const db = new Low(adapter);
await db.read();
const quotes = db.data.quotesList;
const nicks = db.data.nicknames;


export class Quote {

    static getAllQuotes() {
        return quotes;
    }

    static getQuoteById(id) {
        return quotes[id];
    }

    static getAllNames() {
        return "oop"
    }

    static getRandomQuote() {
        return quotes[Math.floor(Math.random() * quotes.length)];
    }
    static getRandomQuoteList(amount) {
        let quoteList = [];
        for (let i; i < amount; i++){
            quoteList.append(this.getRandomQuote());
        }
        return quoteList;
    }
    static async addQuote(quoteSubj, quoteContent, quoteAuth) {
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

