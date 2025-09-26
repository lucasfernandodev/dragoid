import { processChaptersList } from "../../../../core/process-chapter-list.ts";
import { BotError } from "../../../../errors/bot-error.ts";
import { createFetcher } from "../../../../services/fetcher/factorio.ts";
import type {
  Bot,
  BotOptions,
  ChapterList,
  IChapterData,
  MultiDownloadChapterOptions
} from "../../../../types/bot.ts";
import { delay } from "../../../../utils/delay.ts";
import { logger } from "../../../../utils/logger.ts";


export class BotNovelBin implements Bot {
  public options: BotOptions;
  public fetcher = createFetcher('browser')

  constructor(options: BotOptions) {
    this.options = options;
  }

  public getNovel = async (
    url: string,
    opt: Partial<MultiDownloadChapterOptions>
  ) => {
    const meta = await this.getNovelInfo(url);
    logger.debug('Meta info collect:\n', JSON.stringify(meta, null, 2))

    if (!meta.chapterList) {
      throw new BotError('Unable to retrieve chapter list page url')
    }

    if (meta.thumbnail) {
      const thumbnail = await this.options.imageDownloader(meta.thumbnail);
      if (thumbnail) {
        meta.thumbnail = thumbnail;
      }
    }

    const chapterList = await this.getChapterList(meta.chapterList)
    const chapters = await this.getAllChapter(chapterList, opt)
    const { chapterList: _, ...novel } = {
      ...meta,
      chapters: chapters,
      source: url,
    }

    return novel;
  };


  private getNovelInfo = async (url: string) => {
    const { collect } = this.options;
    const page = await this.fetcher.fetch(url);
    const meta = collect.novelInfo(page);
    return meta;
  }


  private getChapterList = async (url: string) => {
    const { collect } = this.options;
    const page = await this.fetcher.fetch(url);
    const list = collect.chapterList(page)
    return list;
  }

  public getChapter = async (url: string) => {
    const { collect } = this.options
    const page = await this.fetcher.fetch(url);
    const chapter = collect.chapter(page);
    await this.fetcher.closeBrowser()
    return chapter;
  }

  public getAllChapter = async (
    chapterList: ChapterList,
    opt: Partial<MultiDownloadChapterOptions>
  ) => {
    const { collect } = this.options
    const chapters = [] as IChapterData[];
    await processChaptersList(chapterList, async ({ url }, index) => {
      const page = await this.fetcher.fetch(url);
      const chapter = collect.chapter(page);
      chapters.push(chapter)

      if (index !== 0 && index % 100 === 0) {
        await delay(30000);
        logger.debug(`processChaptersList: Downloaded ${index} chapters. `)
        logger.debug('processChaptersList: Waiting 30 seconds to avoid rate limits...')
      }
    }, opt)
    await this.fetcher.closeBrowser()
    return chapters;
  }
}