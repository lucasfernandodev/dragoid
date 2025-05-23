#!/usr/bin/env node

import yargs from "yargs";
import { errorHandle } from "./errors/error-handle.ts";
import { Download } from "./commands/download/index.ts";
import { Preview } from "./commands/preview/index.ts";
import { GenerateOutputFile } from "./commands/download/generate-output-file.ts";
import { BotReadNovelFull } from "./commands/download/bots/readnovelfull/index.ts"; 
import { Bot69yuedu } from "./commands/download/bots/69yuedu/index.ts";
import type { TypeCommandPreviewArgs } from "./types/command-preview-args.ts";
import type { TypeCommandDownloadArgs } from "./types/command-download-args.ts";
import { getCurrentVersion } from "./utils/helper.ts";
import { logger } from "./utils/logger.ts";
import { Bot69Shuba } from "./commands/download/bots/69shuba/index.ts";

const _yargs = yargs(process.argv.slice(2))

// Get Errors
process.on("unhandledRejection", errorHandle);
process.on("uncaughtException", errorHandle)

const bots = [
  new BotReadNovelFull(),
  new Bot69yuedu(),
  new Bot69Shuba()
]

const downloadClient = new Download(bots, new GenerateOutputFile())
const previewClient = new Preview()


// Mode Download
_yargs.command<TypeCommandDownloadArgs>(
  downloadClient.commandEntry,
  downloadClient.describe,
  downloadClient.parserInputs,
  downloadClient.handler
)

// Mode Preview
_yargs.command<TypeCommandPreviewArgs>(
  previewClient.commandEntry,
  previewClient.describe,
  previewClient.parserInputs,
  previewClient.handler
)

_yargs
.locale('en')
.help()
.version(false)
.option({
  version: {
    alias: 'v',
    type: 'boolean',
  }
}) 
.fail((msg, err) => { 
  if(err){
    errorHandle(err)
    return;
  } 
}).parse()

if ((_yargs.argv as any).version === true) {
  logger.info(process.env.VERSION_PLACEHOLDER || await getCurrentVersion() || '')
  process.exit(0)
}