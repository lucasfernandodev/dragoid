#!/usr/bin/env node

import yargs from "yargs";
import { Download } from "./commands/download/index.ts";
import { Preview } from "./commands/web-preview/index.ts";
import { GenerateOutputFile } from "./commands/download/generate-output-file.ts";
import { BotReadNovelFull } from "./commands/download/bots/readnovelfull/index.ts";
import type { CLIOptionsDownloadType } from "./types/cli-options-download.ts";
import type { CLIOptionsPreviewType } from "./types/cli-options-preview.ts";
import { Bot69yuedu } from "./commands/download/bots/69yuedu/index.ts";
import { errorHandle } from "./errors/error-handle.ts";

const _yargs = yargs(process.argv.slice(2))

// Get Errors
process.on("unhandledRejection", errorHandle);
process.on("uncaughtException", errorHandle)

const bots = [
  new BotReadNovelFull(),
  new Bot69yuedu()
]

const downloadClient = new Download(bots, new GenerateOutputFile())

const previewClient = new Preview()


// Mode Download
_yargs.command<CLIOptionsDownloadType>(
  downloadClient.commandEntry,
  downloadClient.describe,
  downloadClient.parserInputs,
  downloadClient.handler
)

// Mode Preview
_yargs.command<CLIOptionsPreviewType>(
  previewClient.commandEntry,
  previewClient.describe,
  previewClient.parserInputs,
  previewClient.handler
)

_yargs.locale('en').help().fail((msg, err) => { 
  if(err){
    errorHandle(err)
    return;
  } 
}).parse()