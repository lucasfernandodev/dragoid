import { load } from "cheerio"
import type { ChapterList } from "../../../../../types/bot.ts";
import { BotError } from "../../../../../errors/bot-error.ts";

export const collectChapterList = (page: string) => {
  const $ = load(page);
  const list: ChapterList = [];

  $('#catalog ul li a').each((_, el) => {
    const link = $(el);
    const url = link.attr('href');
    const title = link.attr('title') || link.text().trim();

    if(url && title){
      list.push({url, title})
    }
  })

  if(list.length === 0){
    throw new BotError('Collect chapter list failed! Empty list')
  }

  return list
}