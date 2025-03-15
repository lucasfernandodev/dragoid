import yargs from "yargs";
import { DefaultCommand } from "../../types/command.ts";
import { readFile } from "../../utils/file.ts";
import type { INovelData } from "../../types/bot.ts";
import { Server } from "./server.ts";
import type { CLIOptionsPreviewType } from "../../types/cli-options-preview.ts";
import { logger } from "../../utils/logger.ts";
import path from "path";

export class Preview implements DefaultCommand {
  commandEntry = 'preview';
  describe = 'Start a local server with a web reader to preview novel file';

  parserInputs = (args: yargs.Argv<{}>) => {
    return args.usage('$0 preview --file=<novel-file>')
      .options({
        help: { alias: 'h', description: 'Show help', },
        file: {
          alias: 'f',
          type: 'string',
          description: 'Path to novel JSON file.'
        }
      }).check((args) => {
        const filepath = args['file']; 
        
        if (!filepath) {
          logger.error("The '--file' argument is required", 1, true)
        }

        if (path.extname(filepath as string) !== '.json') {
          logger.error("The file provided does not have a .json extension.",1,true);
        }

        return true;
      });
  };

  public handler = async (args: Partial<CLIOptionsPreviewType>) => {
    const filepath = args['file'];

    if (!filepath) {
      logger.error("The '--file' argument is required", 1, true)
    }

    const file = await readFile<INovelData>(filepath as string);

    if (file) {
      const server = new Server(file);
      server.init();
      return;
    }

    logger.error('Error reading the JSON file. Please ensure that the file exists and is in a valid JSON format.', 1, true)
  };
}