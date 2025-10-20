import type { Argv } from "yargs";
import { DefaultCommand } from "../../types/command.ts";
import { readFile } from "../../utils/file.ts";
import type { IChapterData, INovelData } from "../../types/bot.ts";
import { Server } from "./server.ts";
import { ValidationError } from "../../errors/validation-error.ts";
import { novelSchema } from '../../core/schemas/novel.ts';
import {
  type PreviewArgs,
  type PreviewOptionsMapped,
  setPreviewOptions,
  CMD_PREVIEW_PROXY_FLAGS
} from './options.ts';
import { validatePreviewInput } from './validate-input.ts';
import { chapterScheme } from "../../core/schemas/chapter.ts";
import { ZodError } from "zod";

interface PreviewFiles {
  novel: INovelData | null;
  chapter: IChapterData | null;
}

export class Preview implements DefaultCommand {
  public commandEntry = 'preview';
  public describe = 'Start a local server with a web reader to preview novel file';
  private files: PreviewFiles = {
    novel: null,
    chapter: null,
  };

  private options = {} as PreviewOptionsMapped

  parserInputs = async (args: Argv<PreviewArgs>) => {
    const options = setPreviewOptions(args)
    options.check((args) => validatePreviewInput(args))

    const argv = await options.argv;

    // Map CLI flag values from argv to internal option keys
    for (const [proxyName, flag] of Object.entries(CMD_PREVIEW_PROXY_FLAGS)) {
      const value = argv[flag]
      const proxy = proxyName as keyof PreviewOptionsMapped
      this.options[proxy] = value as never
    }

    const file = await readFile<INovelData>(this.options.file as string)

    if (!file) {
      throw new ValidationError(
        'Failed to load the JSON file. Ensure the file exists, is accessible, and contains valid JSON.'
      )
    }

    const isSafeChapter = await chapterScheme.safeParseAsync(file);

    if (isSafeChapter.success) {
      this.files.chapter = isSafeChapter.data;
      return true
    }

    const isSafeNovel = await novelSchema.safeParseAsync(file);

    if (isSafeNovel.success) {
      this.files.novel = isSafeNovel.data;
      return true
    }

    const combinedErrors = [
      ...(isSafeChapter.error?.issues || []),
      ...(isSafeNovel.error?.issues || [])
    ];

    // Cria uma nova ZodError com os erros combinados
    const combinedZodError = new ZodError(combinedErrors);

    throw new ValidationError(
      'The JSON file is not in the expected format. Ensure it contains the required data structure.',
      combinedZodError
    );
  };




  public handler = async () => {
    if (this.files.novel || this.files.chapter) {
      const server = new Server({
        files: this.files,
        opt: {
          isPublic: this.options.public || false,
          port: this.options.port || 3010,
        }
      });

      server.init();
      return;
    }
  };
}