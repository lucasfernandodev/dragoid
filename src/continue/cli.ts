import { parseURL, removeTypesFromHelpCommand } from "../utils.ts";
import { CLIGenerateOuputFile } from "./cli-generate-ouput-file.ts";
import { CLIListCrawlers } from "./cli-list-crawlers.ts";
import { CLIListOutputFormats } from "./cli-list-ouput-formats.ts";
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

type Crawler = {
  name: string,
  getNovel: (url: string) => Promise<NovelOutput>,
  getChapter: (url: string) => Promise<NovelOutput['chapters'][0]>
}

type ArgsNovel = {
  mode: 'novel',
  url: string,
  'output-format': 'json' | 'html' | 'epub',
  'list-formats': unknown,
  'list-crawlers': unknown
}

type ArgsChapter = {
  mode: 'chapter',
  url: string,
  'output-format': 'json' | 'html',
  'list-formats': unknown,
  'list-crawlers': unknown
}

type ARGSType = Partial<ArgsNovel> | Partial<ArgsChapter>

export interface NovelOutput {
  title: string;
  description: string;
  genres: string[];
  author: string[];
  chapters: { title: string, content: string[] }[];
}

export class Cli {
  private args: ARGSType;
  private crawlers = [] as Crawler[]

  constructor(args: string[], crawlers: Crawler[] = []) {
    this.args = yargs(hideBin(args))
      .locale('en')
      .options({
        help: { alias: 'h', description: 'Show help', },
        mode: {
          group: 'Download',
          alias: 'm',
          choices: ['novel', 'chapter'] as const,
          description: 'Specify the mode for download'
        },
        url: {
          group: 'Download',
          alias: 'u',
          type: 'string' as const,
          description: 'Provide the URL of the novel or chapter you want to download.'
        },
        'output-format': {
          group: 'Output Options',
          alias: 'o',
          type: 'string',
          description: 'Specifies the file format for the downloaded novel or chapter.'
        },
        'list-crawlers': {
          group: 'List Options',
          description: 'List supported websites and crawlers for downloading.'
        },
        'list-formats': {
          group: 'List Options',
          description: 'List available output formats for the selected mode (requires --mode).'
        },
      })
      .check((args) => {
        const outputFormats = {
          novel: ['json', 'epub', 'html'],
          chapter: ['json', 'html']
        }
        const argsArray = Object.keys(args).filter(i => i !== "_" && i !== "$0");

        if (argsArray.length === 0) {
          console.error('Error: No arguments provided. Use --mode ("novel" or "chapter") and --url to start a download. Run --help for more information.');
          console.info('\n Usage: dragoid --mode=<mode> --url=<url> [options]')
          process.exit(1)
        }


        // Erro ao listar os formatos de saida - falta do argumento mode
        if (args['list-formats'] && !args.mode) {
          console.error('Error: The --list-formats option requires --mode to be specified. Please provide --mode to see available output formats.')
          process.exit(1)
        }


        // Erro: Usuário não passou os dois argumentos obrigatórios para o download
        if (!args['list-formats'] && (args.mode && !args.url || !args.mode && args.url)) {
          console.error('Error: Missing required options. Use --mode ("novel" or "chapter") to choose what to download and --url to specify the source.')
          process.exit(1)
        }

        // Erro: Usuário quer listar os formatos de saida mas não passou o argumento mode
        if (args['list-formats'] && !args.mode) {
          console.error('Error: The --list-formats option requires --mode to be specified. Use --mode=novel or --mode=chapter to list available formats.')
          process.exit(1)
        }

        // Checa se o usuario escolher um tipo de arquivo de saida valido
        if (args['output-format'] && args.mode) {
          const output = args['output-format'];
          const isValidOutput = outputFormats[args.mode].find(i => i.toLowerCase() === output);

          if (!isValidOutput) {
            console.error('Error: Invalid output format. Use --list-formats --mode=<mode> to see available formats.')
            process.exit(1)
          }
        }

        return true;
      })
      .parseSync(process.argv.slice(0), removeTypesFromHelpCommand) as ARGSType;

    crawlers.forEach(c => this.crawlers.push(c))
  }

  public handle = async () => {

    if (this.args.url && this.args.mode) {
      const parsedURL = parseURL(this.args.url);
      const domain = parsedURL.hostname.split('.')[0];
      const crawler = this.crawlers.find(c => c.name === domain);

      if (!crawler) {
        console.error('No crawlers found')
        process.exit(1)
      }

      await this.execute(crawler, { mode: this.args.mode, url: this.args.url })
    }

    if (this.args['list-crawlers']) {
      CLIListCrawlers(this.crawlers.map(c => c.name))
    }

    if (this.args['list-formats'] && this.args.mode) {
      CLIListOutputFormats(this.args.mode)
    }
  };


  public execute = async (crawler: Crawler, config: { mode: 'novel' | 'chapter', url: string }) => {
    if (config.mode === 'novel') {
      const novel = await crawler.getNovel(config.url);
      console.log(`All Chapters downloaded with success!`)
      CLIGenerateOuputFile({
        data: novel,
        mode: 'novel',
        filename: novel.title,
        type: this.args['output-format'] as 'json' | 'html' | undefined
      })
    }

    if (config.mode === 'chapter') {
      const chapter = await crawler.getChapter(config.url);
      CLIGenerateOuputFile({
        data: chapter,
        mode: 'chapter',
        filename: chapter.title,
        type: this.args['output-format'] as 'json' | 'html' | undefined
      })
    }
  };
}