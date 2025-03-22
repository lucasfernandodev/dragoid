import { BaseError } from './base-error.ts';

export class ValidationError extends BaseError{
  constructor(message: string, debug: Error |null = null) {
    super('Validation Error', message, debug)
  }
}