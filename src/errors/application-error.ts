import { BaseError } from "./base-error.ts";

export class ApplicationError extends BaseError {
  constructor(message: string, debug: Error | null | unknown = null) {
    super('Application Error', message, debug)
  }
}