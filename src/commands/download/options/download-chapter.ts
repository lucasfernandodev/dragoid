import chalk from "chalk";
import { BotError } from "../../../errors/bot-error.ts";
import type { Bot } from "../../../types/bot.ts";
import { logger } from "../../../utils/logger.ts";
import { generateOutputFile } from "../output.ts";
import type { outputSupported } from "../../../core/configurations.ts";
import type { Writeable } from "../../../types/writeable.ts";

export type DownChapterOuputFormat = Writeable<typeof outputSupported.chapter>[number]

export const downloadChapterService = async (
  bot: Bot,
  url: string,
  outputFormat: DownChapterOuputFormat,
  outputFolder?: string,
) => {
  logger.info('[-] Starting retrieve chapter');
  const chapter = await bot.getChapter(url);

  if (!chapter) {
    throw new BotError('Collect chapter data failed')
  }

  logger.info('[✔] Chapter retrieve with success;');
  logger.info("[-] Starting generate output file");

  await generateOutputFile.chapter[outputFormat](
    chapter.title,
    chapter,
    outputFolder
  )

  logger.info(`[✔] File "${chalk.blueBright(chapter.title)}" has been written successfully.`)
}