import { _getChapter } from './_get-chapter.ts';
import { _getNovel } from './_get-novel.ts';
import type { Bot, IChapterData, INovelData } from "../../../types/bot.ts";

type GetChapterMethodType = (url: string) => Promise<IChapterData>
type GetNovelMethodType = (url: string, opt: Partial<{ limit: number; skip: number; chapterDownloadDelay: number; }>) => Promise<INovelData | null>

// Bot for https://novelbin.com
export class BotNovelBin implements Bot {
  public name = 'novelbin';
  public help = {
    scraping_tool: 'puppeteer',
    site: 'https://novelbin.com'
  };


  public getNovel: GetNovelMethodType = _getNovel
  public getChapter: GetChapterMethodType = _getChapter
}