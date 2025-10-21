import chalk from 'chalk'
import { BotError } from '../../../errors/bot-error.ts'
import type { Bot, MultiDownloadChapterOptions } from '../../../types/bot.ts'
import { logger } from '../../../utils/logger.ts'
import { generateOutputFile } from '../output.ts'
import type { Writeable } from '../../../types/writeable.ts'
import type { outputSupported } from '../../../core/configurations.ts'

export type DownloadNovelOutputFormat = Writeable<
  (typeof outputSupported.novel)[number]
>

export const downloadNovelService = async (
  bot: Bot,
  url: string,
  outputFormat: DownloadNovelOutputFormat,
  outputFolder?: string,
  opts: Partial<MultiDownloadChapterOptions> = {}
) => {
  logger.info('[-] Starting retrieve novel')
  const novel = await bot.getNovel(url, opts)

  if (!novel) {
    throw new BotError('Collect novel data failed')
  }

  logger.info('[✔] Novel retrieve with success')
  logger.info('[-] Starting generate output file')

  if (!novel.thumbnail) {
    logger.warning('Novel thumbnail failed')
    novel.thumbnail = '<image-url>'
  }

  await generateOutputFile.novel[outputFormat](novel.title, novel, outputFolder)

  logger.info(
    `[✔] File "${chalk.blueBright(novel.title)}" has been written successfully.`
  )
}
