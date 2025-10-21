import type { Argv } from 'yargs'

export const CMD_PREVIEW_PROXY_FLAGS = {
  help: 'help',
  file: 'file',
  public: 'public',
  port: 'port',
} as const

export interface PreviewArgs {
  [CMD_PREVIEW_PROXY_FLAGS.help]?: boolean | unknown
  [CMD_PREVIEW_PROXY_FLAGS.file]?: string
  [CMD_PREVIEW_PROXY_FLAGS.public]?: boolean
  [CMD_PREVIEW_PROXY_FLAGS.port]?: number
}

export type PreviewOptionsMapped = {
  -readonly [k in keyof typeof CMD_PREVIEW_PROXY_FLAGS]: PreviewArgs[(typeof CMD_PREVIEW_PROXY_FLAGS)[k]]
}

/**
  Configures the options available for the preview command
  and defines the texts that will be displayed in the help menu.
*/
export const setPreviewOptions = (command: Argv<PreviewArgs>) => {
  const { help, file, port, public: publicFlagKey } = CMD_PREVIEW_PROXY_FLAGS

  const options = command.usage('$0 preview [options]').options({
    [help]: { alias: 'h', description: 'Show help' },
    [file]: {
      alias: 'f',
      type: 'string',
      description: 'Path to novel JSON file.',
    },
    [publicFlagKey]: {
      alias: 'p',
      type: 'boolean',
      default: false,
      description:
        'Makes the server accessible to other devices on the same network',
    },
    [port]: {
      type: 'number',
      default: 3010,
      description: 'Port to bind the server',
    },
  })

  return options
}
