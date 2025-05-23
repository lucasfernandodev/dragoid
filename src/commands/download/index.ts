import yargs, { type Options } from "yargs";
import { DefaultCommand } from "../../types/command.ts";
import { validateInput } from "./validate-input.ts";
import { Bot } from "../../types/bot.ts";
import { GenerateOutputFile } from "./generate-output-file.ts";
import { DownloadOptions } from "./options.ts";
import { ApplicationError } from "../../errors/application-error.ts";
import type { TypeCommandDownloadArgs } from "../../types/command-download-args.ts";


export class Download implements DefaultCommand {
  bots: Bot[] = [];
  generateoutputFile: GenerateOutputFile;
  commandEntry: string = 'download';
  describe: string = 'Downloads a complete novel or a specific chapter.';

  constructor(bots: Bot[], generateOutputFile: GenerateOutputFile) {
    this.bots = bots;
    this.generateoutputFile = generateOutputFile
  }


  parserInputs = (args: yargs.Argv<{ [key: string]: Options }>) => {
    const Options = args.usage('$0 --mode=<novel|chapter> --url=<URL> --output-format=<JSON|HTML|EPUB>')
      .options({
        help: { alias: 'h', description: 'Show help', },
        mode: {
          group: 'Download',
          alias: 'm',
          type: 'string' as const,
          choices: ['novel', 'chapter'] as const,
          description: 'Choose whether you want to download all chapters of the novel or just one chapter'
        },
        url: {
          group: 'Download',
          alias: 'u',
          type: 'string' as const,
          description: 'Provide the URL of the novel or chapter you want to download.'
        },
        'output-format': {
          group: 'Download',
          alias: 'o',
          type: 'string',
          description: 'Specify the type of generated file.',
        },
        'list-crawlers': {
          group: 'List Options',
          description: 'List supported websites and crawlers for downloading.',
          type: 'boolean'
        },
        'list-output-formats': {
          group: 'List Options',
          description: 'List supported file outputs format',
          type: 'boolean'
        },
        'limit': {
          group: "Download Novel",
          alias: 'l',
          type: 'number',
          description: 'Limits the number of chapter downloads'
        },
        'skip': {
          group: "Download Novel",
          alias: 's',
          type: 'number',
          description: 'Defines from which chapter the download starts',
        }
      })


    Options.check(args => validateInput(args))

    return Options;
  };


  private selectBot = (url: string) => {
    const urlObject = new URL(url);
    const urlDomain = urlObject.hostname;
    const siteName = urlDomain.split('.').length === 3 ? urlDomain.split('.')[1] : urlDomain.split('.')[0]
    const isBot = this.bots.find(bot => bot.name === siteName);

    if (!isBot) {
      throw new ApplicationError('Website not supported')
    }

    return isBot;
  }

  public handler = async (args: Partial<TypeCommandDownloadArgs>) => {

    const cliOptions = new DownloadOptions(
      new GenerateOutputFile()
    );


    if (args?.url && args?.mode && args['output-format']) {
      const bot = this.selectBot(args.url);

      if (args.mode === 'chapter' && bot) {
        cliOptions.handlerChapter(args.url, bot, args['output-format'])
      }

      if (args.mode === 'novel' && bot) {
        const data = {
          url: args.url,
          opt: {
            limit: args.limit,
            skip: args.skip
          }
        }

        cliOptions.handlerNovel(data, bot, args['output-format'])
      }
    }

    if (args['list-crawlers']) {

      cliOptions.listBots(this.bots)
    }

    if (args['list-output-formats']) {
      cliOptions.listOutputFormats()
    }
  }
}