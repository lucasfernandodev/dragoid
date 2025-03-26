import type { TypeCommandPreviewArgs } from './../../types/command-preview-args.ts';
import yargs from "yargs";
import { DefaultCommand } from "../../types/command.ts";
import { fileExists, readFile } from "../../utils/file.ts";
import type { INovelData } from "../../types/bot.ts";
import { Server } from "./server.ts";
import path from "path";
import { ValidationError } from "../../errors/validation-error.ts";
import { novelFileSchema } from '../download/schemas/novel.ts'; 

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
        },
        public: {
          alias: 'p',
          type: 'boolean',
          default: false,
          description: 'Makes the server accessible to other devices on the same network'
        }
        
      }).check((args) => {
        const filepath = args['file'];
        const publicOption = args['public']
        
        if (!filepath) {
          throw new ValidationError("Missing required argument '--file'. Please provide the path to a JSON file.")
        }

        if (filepath.length > 120) {
          throw new ValidationError('Invalid file path: the path exceeds the maximum allowed length of 120 characters.')
        }

        if (path.extname(filepath as string) !== '.json') {
          throw new ValidationError(`Invalid file extension for '${filepath}'. Expected a file with a '.json' extension.`);
        }

        if(publicOption !== true && publicOption !== false){
          throw new ValidationError(`Invalid argument: --public only accepts boolean values (true or false).`)
        }

        return true;
      });
  };

  public handler = async (args: TypeCommandPreviewArgs) => {
    const filepath = args['file'];
    const isPublicServer = args['public']

    const isExistFile = await fileExists(filepath)

    if (!isExistFile) {
      throw new ValidationError(`File not found: ${filepath}`)
    }

    const file = await readFile<INovelData>(filepath as string);

    if (!file) {
      throw new ValidationError(
        'Failed to load the JSON file. Ensure the file exists, is accessible, and contains valid JSON.'
      )
    }

    const isValidatedFile = await novelFileSchema.safeParseAsync(file);
    if (!isValidatedFile.success) {
      throw new ValidationError(
        'The JSON file is not in the expected format. Ensure it contains the required data structure.',
        isValidatedFile.error
      )
    }

    if (file) { 
      const server = new Server(file, {
        isPublic: isPublicServer ? true : false
      });
      server.init();
      return;
    }
  };
}