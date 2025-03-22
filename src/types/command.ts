import yargs, {type  Options } from "yargs";

export abstract class DefaultCommand {
  commandEntry: string;
  describe: string;
  parserInputs: (args: yargs.Argv<{}>) => any
  handler: (args: any) => void;
}
