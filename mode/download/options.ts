import { Bot } from "../../types/bot.ts";
import { novelSchema } from "./schemas/novel.ts";
import { GenerateOutputFile } from "./generate-output-file.ts";
import chalk from "chalk";
import { chapterScheme } from "./schemas/chapter.ts";
import { logger } from "../../utils/logger.ts";

export class DownloadOptions {

  private generateFile: GenerateOutputFile
  constructor(generateFile: GenerateOutputFile) {
    this.generateFile = generateFile
  }

  public handlerNovel = async (url: string, bot: Bot, format: 'html' | 'json') => {
    logger.info('[-] Starting retrive novel')
    const novel = await bot.getNovel(url);

    if (!novel) return logger.error('[x] Unable to retrieve Novel', 1, true);

    const isValidData = novelSchema.safeParse(novel)
    if (!isValidData.success) return logger.error('[x] Retrive Data invalid', 1, true)

    logger.info('[✔] Novel Retrive with success');
    logger.info("[-] Starting generate output file");

    await this.generateFile.execute({
      mode: 'novel',
      format: format,
      filename: novel.title,
      novel
    })

    logger.info(`[✔] File "${chalk.blueBright(novel.title)}" has been written successfully.`)
  }




  public handlerChapter = async (url: string, bot: Bot, format: 'html' | 'json') => {
    logger.info('[-] Starting retrive chapter');
    const chapter = await bot.getChapter(url);

    if (!chapter) return logger.error('Unable to retrieve chapter', 1, true);
    const isValidData = chapterScheme.safeParse(chapter);
    if (!isValidData.success) return logger.error('[x] Error: Retrive Data invalid', 1, true);

    logger.info('[✔] Chapter retrive with sucess;');
    logger.info("[-] Starting generate output file");
    await this.generateFile.execute({
      mode: 'chapter',
      format: format,
      filename: chapter.title,
      chapter
    })

    logger.info(`[✔] File "${chalk.blueBright(chapter.title)}" has been written successfully.`)
  }


  public listBots = (bots: Bot[]) => {
    const content = bots.map(bot => `[🤖] Bot ${bot.name} \n${bot.help} `).join('\n\n');

    return logger.info([
      'List Bots:\n',
      content.length > 0 ? content : 'Bot list is empty'
    ].join('\n'), 1, true, 0)
  };


  public listOutputFormats = () => {
    const formats = this.generateFile.getSupportedFormats();
    logger.info([
      'List of supported format types sorted by download type:',
      '\nNovel: ',
      formats.novel.map(type => `[🗸] ${type}`).join('\n'),
      '\nChapter: ',
      formats.chapter.map(type => `[🗸] ${type}`).join('\n')
    ].join('\n'))
  }
}