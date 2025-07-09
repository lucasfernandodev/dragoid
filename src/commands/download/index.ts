import { DefaultCommand } from "../../types/command.ts";
import { downloadNovelService, type DownloadNovelOutputFormat } from './options/download-novel.ts';
import { validateInput } from "./validate-input.ts";
import { Bot } from "../../types/bot.ts";
import { ApplicationError } from "../../errors/application-error.ts";
import {
  CMD_DOWNLOAD_PROXY_FLAGS,
  setDownloadOptions,
  type DownloadArgs,
  type DownloadOptionsMap
} from "./options.ts";
import { getSiteName } from "../../utils/get-site-name.ts";
import {
  downloadChapterService,
  type DownChapterOuputFormat
} from './options/download-chapter.ts';
import { listCrawlersService } from './options/list-crawlers.ts';
import { listOutputFormatsService } from './options/list-output-formats.ts';
import type { Argv } from "yargs";



export class Download implements DefaultCommand {
  public commandEntry: string = 'download';
  public describe: string = 'Download an entire novel or an individual chapter.';
  private bots: Bot[] = [];
  private options = {} as DownloadOptionsMap

  constructor(bots: Bot[]) {
    this.bots = bots;
  }



  parserInputs = async (args: Argv<DownloadArgs>) => {
    // Set input flags
    const options = setDownloadOptions(args);

    // Validate input flags
    options.check(args => validateInput(args))

    // Validade values
    const argv = await options.argv;

    // Map CLI flag values from argv to internal option keys
    for (const [proxyName, flag] of Object.entries(CMD_DOWNLOAD_PROXY_FLAGS)) {
      const value = argv[flag]
      const proxy = proxyName as keyof DownloadOptionsMap
      this.options[proxy] = value as never
    }

    return options;
  };




  public handler = async () => {

    const {
      mode,
      url,
      outputFormat,
      limit,
      skip,
      listCrawlers,
      listOutputFormats,
      path
    } = this.options;


    if (listCrawlers) {
      listCrawlersService(this.bots)
    }

    if (listOutputFormats) {
      listOutputFormatsService()
    }

    // Is download mode?
    if (mode && url && outputFormat) {
      const siteName = getSiteName(url);
      const bot = this.bots.find(bot => bot.options.name === siteName);

      if (!bot) {
        throw new ApplicationError('Website not supported');
      }

      if (mode === 'chapter') {
        await downloadChapterService(
          bot,
          url,
          outputFormat as DownChapterOuputFormat,
          path
        )
      }

      if (mode === 'novel') {
        const opt = {
          limit,
          skip
        }

        await downloadNovelService(
          bot,
          url,
          outputFormat as DownloadNovelOutputFormat,
          path,
          opt
        )
      }
    }
  }
}