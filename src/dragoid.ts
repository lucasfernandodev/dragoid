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
import { createBotReadNovelFull } from "./commands/download/rebots/readnovelfull/factorio.ts";
import { yargsFailHandle } from "./errors/yargs-fail-handle.ts";
import { createBotMockInstance } from "./commands/download/rebots/mock/factory.ts";

const _yargs = yargs(process.argv.slice(2))

const bot69shuba = createBot69shubaInstance()
const botNovelBin = createBotNovelBinInstance()
const botReadNovelFull = createBotReadNovelFull()
// Mock for tests
const botMock = createBotMockInstance()
const bots = [
  bot69shuba,
  botNovelBin,
  botReadNovelFull,
]


const downloadClient = new Download(
  process.env.USE_BOT_MOCK ? [...bots, botMock] : bots
)

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

_yargs.locale(language);
_yargs
  .help('help')        // ativa --help
  .alias('help', 'h');
_yargs.version(false);



_yargs.option({
  version: {
    alias: 'v',
    type: 'boolean',
  },
});

_yargs.strict();
_yargs.demandCommand(1, 'COMMAND_EMPTY');
_yargs.fail((msg, err) => yargsFailHandle(msg, err, _yargs));

_yargs.parse();



if ((_yargs.argv as Record<string, unknown>).version === true) {
  logger.info(process.env.VERSION_PLACEHOLDER || await getCurrentVersion() || '')
  process.exit(0)
}

// Get Errors
process.on("unhandledRejection", errorHandle);
process.on("uncaughtException", errorHandle)