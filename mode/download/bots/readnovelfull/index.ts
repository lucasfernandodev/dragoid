import { Bot } from "../../../../types/bot.ts";
import { readnovelfullGetChapter } from "./_get-chapter.ts";
import { readnovelfullGetNovel } from "./_get-novel.ts";

export class BotReadNovelFull implements Bot {
  name = 'readnovelfull';
  help = 'Bot for readnovelfull website';

  getNovel = readnovelfullGetNovel;

  getChapter = readnovelfullGetChapter;
}