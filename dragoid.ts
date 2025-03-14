#!/usr/bin/env node

import yargs from "yargs";
import { Download } from "./mode/download/index.ts";
import { Preview } from "./mode/web-preview/index.ts";
import { GenerateOutputFile } from "./mode/download/generate-output-file.ts";
import { BotReadNovelFull } from "./mode/download/bots/readnovelfull/index.ts";
import type { CLIOptionsDownloadType } from "./types/cli-options-download.ts";
import type { CLIOptionsPreviewType } from "./types/cli-options-preview.ts";
import { Bot69yuedu } from "./mode/download/bots/69yuedu/index.ts";

const _yargs = yargs(process.argv.slice(2))


const downloadClient = new Download(
  [
    new BotReadNovelFull(),
    new Bot69yuedu()
  ],
  new GenerateOutputFile()
)

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

_yargs.locale('en').help().parse()