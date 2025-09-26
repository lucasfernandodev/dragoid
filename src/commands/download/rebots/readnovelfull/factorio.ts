import { DownloadBookThumbnail } from "../../../../services/download-book-thumbnail.ts";
import { logger } from "../../../../utils/logger.ts";
import { collectChapterList } from "./collect/chapter-list.ts";
import { collectChapter } from "./collect/chapter.ts";
import { collectNovelInfo } from "./collect/novel-info.ts";
import { BotReadNovelFull } from "./index.ts";

export const createBotReadNovelFull = () => {
  return new BotReadNovelFull({
    name: 'readnovelfull',
    help: {
      site: 'https://readnovelfull.com',
      scraping_tool: 'http'
    },
    imageDownloader: async (url: string) => {
      logger.debug(`Starting thumbnail download: ${url}`)
      const downloadThumbnail = new DownloadBookThumbnail();
      const thumbnail = await downloadThumbnail.execute(url);
      return thumbnail;
    },
    collect: {
      chapter: collectChapter,
      chapterList: collectChapterList,
      novelInfo: collectNovelInfo,
    }
  })
}