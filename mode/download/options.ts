import { BotError } from './../../errors/bot-error.ts';
import { Bot } from "../../types/bot.ts";
import { GenerateOutputFile } from "./generate-output-file.ts";
import chalk from "chalk";
import { logger } from "../../utils/logger.ts";

export class DownloadOptions {

  private generateFile: GenerateOutputFile
  constructor(generateFile: GenerateOutputFile) {
    this.generateFile = generateFile
  }

  public handlerNovel = async (url: string, bot: Bot, format: 'html' | 'json') => {
    logger.info('[-] Starting retrive novel')
    const novel = await bot.getNovel(url);

    if (!novel) {
      throw new BotError('Collect novel data failed')
    }



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

    if (!chapter) {
      throw new BotError('Collect chapter data failed')
    }


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

    logger.info([
      'List Bots:\n',
      content.length > 0 ? content : 'Bot list is empty'
    ].join('\n'))
    
    return;
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