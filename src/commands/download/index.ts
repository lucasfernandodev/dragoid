import { type CmdParseInputType, DefaultCommand } from "../../types/command.ts";
import type { TypeCommandDownloadArgs } from "../../types/command-download-args.ts";
import { downloadNovel } from './options/download-novel.ts';
import { validateInput } from "./validate-input.ts";
import { Bot } from "../../types/bot.ts";
import { ApplicationError } from "../../errors/application-error.ts";
import { setDownloadOptions } from "./options.ts";
import { getSiteName } from "../../utils/get-site-name.ts";
import { downloadChapter } from './options/download-chapter.ts';
import { listCrawlers } from './options/list-crawlers.ts';
import { listOuputFormats } from './options/list-output-formats.ts';


export class Download implements DefaultCommand {
  private bots: Bot[] = [];
  public commandEntry: string = 'download';
  public describe: string = 'Download an entire novel or an individual chapter.';
  private isDownloadOptions = false;
  private selectedBot: Bot | null = null;

  constructor(bots: Bot[]) {
    this.bots = bots;
  }



  parserInputs = async (args: CmdParseInputType) => {
    const options = setDownloadOptions(args);
    options.check(args => validateInput(args))

    const argv = await options.argv

    if (argv['mode'] && argv['url'] && argv['output-format']) {
      this.isDownloadOptions = true;
    }

    if (argv.url) {
      const siteName = getSiteName(argv.url || '');
      const isBot = this.bots.find(bot => bot.name === siteName);

      if (isBot) {
        this.selectedBot = isBot;
        return;
      }

      throw new ApplicationError('Website not supported')
    }


    return options;
  };




  public handler = async (args: TypeCommandDownloadArgs) => {

    if (this.isDownloadOptions && this.selectedBot) {
      const mode = args['mode'];
      const outputformat = args['output-format'];
      const opt = { limit: args.limit, skip: args.skip }
      const url = args.url

      mode === 'novel' && await downloadNovel(
        this.selectedBot,
        url,
        outputformat,
        opt
      )

      mode === 'chapter' && await downloadChapter(
        this.selectedBot,
        url,
        outputformat
      )
    }

    args['list-crawlers'] && listCrawlers(this.bots)
    args['list-output-formats'] && listOuputFormats()
  }
}