import { Bot } from "../../../types/bot.ts";
import { getChapterIn69shuba } from './_get-chapter.ts';
import { getNovel69shuba } from './_get-novel.ts';

export class Bot69Shuba implements Bot{
  name: string = '69shuba';
  help = { 
    scraping_tool: 'puppeteer',
     site: 'https://www.69shuba.com/'
   };


  getNovel = getNovel69shuba

  getChapter = getChapterIn69shuba;

}