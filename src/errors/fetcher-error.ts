import { BaseError } from './base-error.ts';

export class FetcherError extends BaseError {
  constructor(message: string, debug: Error | null | unknown = null) {
    super('Fetcher Error', message, debug)
  }
}