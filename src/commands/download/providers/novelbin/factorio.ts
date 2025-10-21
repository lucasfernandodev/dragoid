import { DownloadBookThumbnail } from '../../../../services/download-book-thumbnail.ts'
import { logger } from '../../../../utils/logger.ts'
import { collectChapterList } from './collect/chapter-list.ts'
import { collectChapter } from './collect/chapter.ts'
import { collectNovelInfo } from './collect/novel-info.ts'
import { BotNovelBin } from './index.ts'

export const createBotNovelBinInstance = () => {
  return new BotNovelBin({
    name: 'novelbin',
    help: {
      site: 'https://novelbin.com',
      scraping_tool: 'puppeteer',
    },
    imageDownloader: async (url: string) => {
      logger.debug(`Starting thumbnail download: ${url}`)
      const downloadThumbnail = new DownloadBookThumbnail()
      const thumbnail = await downloadThumbnail.execute(url)
      return thumbnail
    },
    collect: {
      chapter: collectChapter,
      chapterList: collectChapterList,
      novelInfo: collectNovelInfo,
    },
  })
}
