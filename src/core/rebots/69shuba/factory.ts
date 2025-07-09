import { logger } from "../../../utils/logger.ts";
import { ThumbnailProcessor } from "../../download-thumbnail.ts";
import { collectChapterList } from "./collect/chapter-list.ts";
import { collectChapter } from "./collect/chapter.ts";
import { collectNovelInfo } from "./collect/novel-info.ts";
import { Bot69shuba } from "./index.ts"

export const createBot69shubaInstance = () => {
  return new Bot69shuba({
    name: '69shuba',
    help: {
      site: 'https://www.69shuba.com/',
      scraping_tool: 'puppeteer'
    },
    imageDownloader: async (url: string) => {
      logger.debug(`Starting thumbnail download: ${url}`)
      const thumbnailProcessor = new ThumbnailProcessor(url);
      const thumbnail = await thumbnailProcessor.execute();
      return thumbnail;
    },
    collect: {
      chapter: collectChapter,
      chapterList: collectChapterList,
      novelInfo: collectNovelInfo,
    }
  })
}