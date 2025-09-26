import type { Argv } from "yargs";
import { CommandError } from "./command-error.ts";
import { errorHandle } from "./error-handle.ts";

export type ParsedYargsMessage =
  | { kind: 'COMMAND_EMPTY' }
  | { kind: 'UNKNOWN_ARGS'; args: string[] }
  | { kind: 'OTHER'; raw: string };

const parseYargsMessage = (text: string): ParsedYargsMessage => {
  if (text.includes('COMMAND_EMPTY')) {
    return { kind: 'COMMAND_EMPTY' }
  }

  if (text.includes('Unknown arguments') && text.includes(",")) {
    const values = text.replace('Unknown arguments:', "").trim();
    const valuesArray = values.split(",");
    return { kind: 'UNKNOWN_ARGS', args: valuesArray }
  }

  if (text.includes('Unknown argument:')) {
    const values = text.replace('Unknown argument:', "").trim();
    return { kind: 'UNKNOWN_ARGS', args: [values] }
  }

  return { kind: 'OTHER', raw: text };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const yargsFailHandle = (message: unknown, error: Error, yargs: Argv<any>) => {
  if (error) {
    errorHandle(error)
    return;
  }


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const _argv = (yargs as any).parsed.argv

  if (typeof message !== 'string') return;

  const parsed = parseYargsMessage(message)

  switch (parsed.kind) {
    case 'COMMAND_EMPTY': {
      if (_argv?.version || _argv?.v || _argv?.help || _argv?.h) return
      const error = new CommandError(
        `You need to provide a valid command. Use --help for more information.`
      )
      errorHandle(error)
      return
    }
    case 'UNKNOWN_ARGS': {
      const error = new CommandError(
        `Unexpected additional argument: ${parsed.args.join(", ")}`
      )
      errorHandle(error)
      return;
    }
    case 'OTHER': {
      errorHandle(new CommandError(parsed.raw));
      return;
    }
  }
}