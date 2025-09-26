import { BaseError } from "./base-error.ts";

export class CommandError extends BaseError {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, debug: any = null) {
    super('Command Error', message, debug)
  }
}