import type { Bot, BotOptions, ChapterList, IChapterData, INovelData, INovelMeta, MultiDownloadChapterOptions } from "../../../../types/bot.ts";
import { logger } from "../../../../utils/logger.ts";

export class MockBot implements Bot {
  public options: BotOptions;

  constructor(options: BotOptions) {
    this.options = options;
  }

  public getNovel: (
    url: string,
    opt: Partial<MultiDownloadChapterOptions>
  ) => Promise<INovelData> = async () => {
    const meta = this.options.collect.novelInfo('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (meta as any).chapterList;

    return {
      ...meta,
      chapters: new Array(10).fill(null).map(_ => (this.options.collect.chapter('')))
    }
  };

  public getChapter: (url: string) => Promise<IChapterData> = async () => this.options.collect.chapter('');
  public getAllChapter: (chapterList: ChapterList, opt: Partial<MultiDownloadChapterOptions>) => Promise<IChapterData[]> = async () => {
    return new Array(10).fill(null).map(_ => this.options.collect.chapter(''))
  }
}

export const createBotMockInstance = (): Bot => {
  return new MockBot({
    name: 'mock-bot',
    help: {
      site: 'https://mock-bot.com',
      scraping_tool: 'puppeteer'
    },
    imageDownloader: async () => {
      return null;
    },
    collect: {
      chapter: (): IChapterData => {
        logger.debug(`[MOCK BOT]: Chapter download accept!`);
        return {
          title: 'Mock chapter',
          content: ['Mock content row 1', 'Mock content row 2']
        }
      },
      chapterList: (url: string): ChapterList => {
        logger.debug(`[MOCK BOT]: Chapter list download ${url} accept!`);
        return [
          { title: 'mock chapter 1', "url": "http://mock-bot.com/chapter/1" }
        ]
      },
      novelInfo: (): INovelMeta => {
        logger.debug(`[MOCK BOT]: Novel meta download accept!`);
        return {
          thumbnail: '<image>',
          title: 'Mocked Novel',
          author: ['john Quick'],
          genres: ['action'],
          description: ['Mocked Novel for tests'],
          language: 'English',
          status: 'ongoing',
          chapterList: 'http://mock-bot.com/chapter-list'
        }

      },
    }
  })
}