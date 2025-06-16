import type { Argv } from "yargs";
import { DefaultCommand } from "../../types/command.ts";
import { readFile } from "../../utils/file.ts";
import type { INovelData } from "../../types/bot.ts";
import { Server } from "./server.ts";
import { ValidationError } from "../../errors/validation-error.ts";
import { novelFileSchema } from '../../core/schemas/novel.ts';
import {
  type PreviewArgs,
  type PreviewOptionsMapped,
  setPreviewOptions,
  CMD_PREVIEW_PROXY_FLAGS
} from './options.ts';
import { validatePreviewInput } from './validate-input.ts';

export class Preview implements DefaultCommand {
  public commandEntry = 'preview';
  public describe = 'Start a local server with a web reader to preview novel file';
  private file = {} as INovelData;
  private options = {} as PreviewOptionsMapped

  parserInputs = async (args: Argv<PreviewArgs>) => {
    const options = setPreviewOptions(args)
    options.check((args) => validatePreviewInput(args))

    const argv = await options.argv;

    // Map CLI flag values from argv to internal option keys
    for (const [proxyName, flag] of Object.entries(CMD_PREVIEW_PROXY_FLAGS)) {
      const value = argv[flag]
      this.options[proxyName] = value
    }

    const file = await readFile<INovelData>(this.options.file as string)

    if (!file) {
      throw new ValidationError(
        'Failed to load the JSON file. Ensure the file exists, is accessible, and contains valid JSON.'
      )
    }

    const validateFile = await novelFileSchema.safeParseAsync(file);
    if (!validateFile.success) {
      throw new ValidationError(
        'The JSON file is not in the expected format. Ensure it contains the required data structure.',
        validateFile.error
      )
    }

    this.file = file;
  };





  public handler = async () => {

    if (this.file) {
      const server = new Server(this.file, {
        isPublic: this.options.public || false
      });

      server.init();
      return;
    }
  };
}