import { Bot } from "../../../../types/bot.ts";
import { readnovelfullGetChapter } from "./_get-chapter.ts";
import { readnovelfullGetNovel } from "./_get-novel.ts";

export class BotReadNovelFull implements Bot {
  name = 'readnovelfull';
  help = [
    'Tool: Axios',
    'Site: https://readnovelfull.com/'
  ].join("\n")

  getNovel = readnovelfullGetNovel;

  getChapter = readnovelfullGetChapter;
}