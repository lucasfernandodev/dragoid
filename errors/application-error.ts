import { BaseError } from "./base-error.ts";

export class ApplicationError extends BaseError {
  constructor(message: string, debug: Error |null = null) {
    super('Application Error', message, debug)
  }
}