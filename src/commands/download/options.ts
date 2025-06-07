import yargs, { type Options } from "yargs"; 

/**
  Configures the options available for the download command
  and defines the texts that will be displayed in the help menu.
*/
export const setDownloadOptions = (args: yargs.Argv<{ [key: string]: Options }>) => {
  const Options = args.usage('$0 download [options]')
  .options({
    help: { alias: 'h', description: 'Show help', },
    mode: {
      group: 'Download Options',
      alias: 'm',
      type: 'string' as const,
      choices: ['novel', 'chapter'] as const,
      description: 'Download an entire novel (“novel”) or a single chapter (“chapter”)'
    },
    url: {
      group: 'Download Options',
      alias: 'u',
      type: 'string' as const,
      description: 'URL of the novel or chapter to download'
    },
    'output-format': {
      group: 'Download Options',
      alias: 'o',
      type: 'string',
      description: 'Output file format (e.g. json, epub, txt).',
    },
    'limit': {
      group: "Download Options",
      alias: 'l',
      type: 'number',
      description: 'Limit the total number of chapters to download'
    },
    'skip': {
      group: "Download Options",
      alias: 's',
      type: 'number',
      description: 'Begin downloading from chapter number',
    },
    'list-crawlers': {
      group: 'List Options',
      description: 'List all supported websites and crawlers.',
      type: 'boolean'
    },
    'list-output-formats': {
      group: 'List Options',
      description: 'List all supported output formats',
      type: 'boolean'
    },
  })

  return Options;
}