import type { Argv } from 'yargs'

export const CMD_DOWNLOAD_PROXY_FLAGS = {
  help: 'help',
  mode: 'mode',
  url: 'url',
  outputFormat: 'format',
  limit: 'limit',
  skip: 'skip',
  listCrawlers: 'list-crawlers',
  listOutputFormats: 'list-output-formats',
  path: 'path',
} as const

export interface DownloadArgs {
  [CMD_DOWNLOAD_PROXY_FLAGS.help]?: boolean | unknown
  [CMD_DOWNLOAD_PROXY_FLAGS.mode]?: 'novel' | 'chapter'
  [CMD_DOWNLOAD_PROXY_FLAGS.url]?: string
  [CMD_DOWNLOAD_PROXY_FLAGS.outputFormat]?: string
  [CMD_DOWNLOAD_PROXY_FLAGS.limit]?: number
  [CMD_DOWNLOAD_PROXY_FLAGS.skip]?: number
  [CMD_DOWNLOAD_PROXY_FLAGS.listCrawlers]?: boolean
  [CMD_DOWNLOAD_PROXY_FLAGS.listOutputFormats]?: boolean
  [CMD_DOWNLOAD_PROXY_FLAGS.path]?: string
}

export type DownloadOptionsMap = {
  -readonly [k in keyof typeof CMD_DOWNLOAD_PROXY_FLAGS]: DownloadArgs[(typeof CMD_DOWNLOAD_PROXY_FLAGS)[k]]
}

/**
  Configures the options available for the download command
  and defines the texts that will be displayed in the help menu.
*/
export const setDownloadOptions = (args: Argv<DownloadArgs>) => {
  const {
    help,
    mode,
    url,
    limit,
    skip,
    outputFormat,
    path,
    listOutputFormats,
    listCrawlers,
  } = CMD_DOWNLOAD_PROXY_FLAGS

  const Options = args.usage('$0 download [options]').options({
    [help]: { alias: 'h', description: 'Show help' },
    [mode]: {
      group: 'Download Options',
      alias: 'm',
      type: 'string' as const,
      choices: ['novel', 'chapter'] as const,
      description:
        'Download an entire novel (“novel”) or a single chapter (“chapter”)',
    },
    [url]: {
      group: 'Download Options',
      alias: 'u',
      type: 'string' as const,
      description: 'URL of the novel or chapter to download',
    },
    [outputFormat]: {
      group: 'Download Options',
      alias: 'o',
      type: 'string',
      description: 'Output file format (e.g. json, epub, txt).',
    },
    [path]: {
      group: 'Download Options',
      alias: 'p',
      type: 'string',
      description: 'Path to the folder where the file will be saved',
    },
    [limit]: {
      group: 'Download Options',
      alias: 'l',
      type: 'number',
      description: 'Limit the total number of chapters to download',
    },
    [skip]: {
      group: 'Download Options',
      alias: 's',
      type: 'number',
      description: 'Begin downloading from chapter number',
    },
    [listCrawlers]: {
      group: 'List Options',
      description: 'List all supported websites and crawlers.',
      type: 'boolean',
    },
    [listOutputFormats]: {
      group: 'List Options',
      description: 'List all supported output formats',
      type: 'boolean',
    },
  })

  return Options
}
