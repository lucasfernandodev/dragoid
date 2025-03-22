import { Bot } from "../../../../types/bot.ts";
import { readnovelfullGetChapter } from "./_get-chapter.ts";
import { readnovelfullGetNovel } from "./_get-novel.ts";

export class BotReadNovelFull implements Bot {
  name = 'readnovelfull';
  help = {
    scraping_tool: 'axios',
    site: 'https://readnovelfull.com/'
  }

  getNovel = readnovelfullGetNovel;

  getChapter = readnovelfullGetChapter;
}