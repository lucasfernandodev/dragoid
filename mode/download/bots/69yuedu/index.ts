import { Bot } from "../../../../types/bot.ts";
import { getChapterIn69yeudu } from "./_get-chapter.ts";
import { getNovel69yuedu } from "./_get-novel.ts";

export class Bot69yuedu implements Bot {  
  name = '69yuedu';
  help = [
    'Tool: Puppeteer',
    'site: https://www.69yuedu.net/'
  ].join("\n")


  getNovel = getNovel69yuedu;

  getChapter = getChapterIn69yeudu;
}