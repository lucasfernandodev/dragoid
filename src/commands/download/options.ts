import { BotError } from './../../errors/bot-error.ts';
import { Bot, type DownloadNovelOptions } from "../../types/bot.ts";
import { GenerateOutputFile } from "./generate-output-file.ts";
import chalk from "chalk";
import { logger } from "../../utils/logger.ts";

interface IHandlerNovelData {
  url: string;
  opt: DownloadNovelOptions
}

export class DownloadOptions {

  private generateFile: GenerateOutputFile
  constructor(generateFile: GenerateOutputFile) {
    this.generateFile = generateFile
  }

  public handlerNovel = async ({ url, opt }: IHandlerNovelData, bot: Bot, format: string) => {
    logger.info('[-] Starting retrive novel')
    const novel = await bot.getNovel(url, opt);

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




  public handlerChapter = async (url: string, bot: Bot, format: string) => {
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
    const content = bots.map(bot => {
      const name = bot.name;
      const tool = bot.help.scraping_tool;
      const site = bot.help.site;

      return `Bot ${name} \n` + `Tool: ${tool} \n` + `Site: ${site} \n\n`;
    });

    logger.info("List Bots \n")
    logger.info(content.join(""))

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