import chalk from "chalk";
import { BotError } from "../../../errors/bot-error.ts";
import type { Bot } from "../../../types/bot.ts";
import { logger } from "../../../utils/logger.ts";
import { generateOutputFile } from "../output.ts";

export const downloadChapterService = async (
  bot: Bot,
  url: string,
  outputFormat: string,
) => {
  logger.info('[-] Starting retrive chapter');
  const chapter = await bot.getChapter(url);

  if (!chapter) {
    throw new BotError('Collect chapter data failed')
  }


  logger.info('[✔] Chapter retrive with sucess;');
  logger.info("[-] Starting generate output file");

  generateOutputFile.chapter[outputFormat](
    chapter.title,
    chapter
  )

  logger.info(`[✔] File "${chalk.blueBright(chapter.title)}" has been written successfully.`)
}