import { BaseError } from './base-error.ts';

export class BotError extends BaseError{
  constructor(message: string, debug: Error |null = null) {
    super('Bot Error', message, debug)
  }
}