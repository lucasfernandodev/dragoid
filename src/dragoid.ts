#!/usr/bin/env node

import yargs from "yargs";
import { errorHandle } from "./errors/error-handle.ts";
import { Download } from "./commands/download/index.ts";
import { Preview } from "./commands/preview/index.ts";
import { logger } from "./utils/logger.ts";
import { language } from "./core/configurations.ts";
import { getCurrentVersion } from "./utils/get-current-version.ts";
import type { DownloadArgs } from "./commands/download/options.ts";
import type { PreviewArgs } from "./commands/preview/options.ts";
import { createBot69shubaInstance } from "./commands/download/rebots/69shuba/factory.ts";
import { createBotNovelBinInstance } from "./commands/download/rebots/novelbin/factorio.ts";

const _yargs = yargs(process.argv.slice(2))

const bot69shuba = createBot69shubaInstance()
const botNovelBin = createBotNovelBinInstance()

const bots = [
  bot69shuba,
  botNovelBin
]

const downloadClient = new Download(bots)
const previewClient = new Preview()


// Mode Download
_yargs.command<DownloadArgs>(
  downloadClient.commandEntry,
  downloadClient.describe,
  downloadClient.parserInputs,
  downloadClient.handler
)

// Mode Preview
_yargs.command<PreviewArgs>(
  previewClient.commandEntry,
  previewClient.describe,
  previewClient.parserInputs,
  previewClient.handler
)

_yargs
  .locale(language)
  .help()
  .version(false)
  .option({
    version: {
      alias: 'v',
      type: 'boolean',
    }
  })
  .fail((_, err) => {
    if (err) {
      errorHandle(err)
      return;
    }
  }).parse()

if ((_yargs.argv as Record<string, unknown>).version === true) {
  logger.info(process.env.VERSION_PLACEHOLDER || await getCurrentVersion() || '')
  process.exit(0)
}

// Get Errors
process.on("unhandledRejection", errorHandle);
process.on("uncaughtException", errorHandle)