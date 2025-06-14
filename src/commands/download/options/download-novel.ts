import chalk from "chalk";
import { BotError } from "../../../errors/bot-error.ts";
import type { Bot, DownloadNovelOptions } from "../../../types/bot.ts";
import { logger } from "../../../utils/logger.ts"; 
import { generateOutputFile } from "../output.ts";

export const downloadNovelService = async (
  bot: Bot,
  url: string,
  outputFormat: string,
  outputFolder: string | null,
  opts: DownloadNovelOptions
) => {
  logger.info('[-] Starting retrive novel')
  const novel = await bot.getNovel(url, opts);

  if (!novel) {
    throw new BotError('Collect novel data failed')
  }

  logger.info('[✔] Novel Retrive with success');
  logger.info("[-] Starting generate output file");

  if(!novel.thumbnail){
    logger.warning('Novel thumbnail failed');
    novel.thumbnail = '<image-url>'
  }


  generateOutputFile.novel[outputFormat](
    novel.title,
    novel,
    outputFolder
  )

  logger.info(`[✔] File "${chalk.blueBright(novel.title)}" has been written successfully.`)
}