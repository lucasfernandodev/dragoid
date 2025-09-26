import { logger } from './../utils/logger.ts';
import { ValidationError } from './validation-error.ts';
import { BotError } from './bot-error.ts';
import { ApplicationError } from './application-error.ts';
import { ZodError } from 'zod';
import { CommandError } from './command-error.ts';

const printStack = (error = {}) => {
  if (process.env.DEBUG !== 'true') return;

  if (error && 'stack' in error) {
    logger.error(JSON.stringify(error.stack, null, 2))
  }
}

export const errorHandle = (error: unknown) => {

  if (error instanceof ApplicationError) {
    logger.error(`Application error: ${error?.message}`);
    printStack(error?.debugMessage)
    process.exit(error.exitCode)
  }

  if (error instanceof CommandError) {
    logger.error(`Command error: ${error?.message}`);
    printStack(error?.debugMessage)
    process.exit(error.exitCode)
  }

  if (error instanceof BotError) {
    logger.error(`Bot error: ${error?.message}`);
    printStack(error?.debugMessage)
    process.exit(error.exitCode)
  }

  if (error instanceof ValidationError) {
    logger.error(`Validation error: ${error?.message}`);
    printStack(error?.debugMessage)
    process.exit(error.exitCode)
  }

  if (error instanceof ZodError) {
    const message = error.issues[0].message;
    logger.error(`Validation error: ${message}`);

    if (process.env.DEBUG === 'true') {
      if (typeof error === 'string') {
        logger.error(error);
      } else {
        logger.error(JSON.stringify(error, null, 2))
      }
    }

    process.exit(1)
  }


  if (process.env.DEBUG === 'true') {
    logger.error(error as string);
    printStack(error as object);
    process.exit(1);
  }

  logger.error('\nAn unexpected error occurred. To view more details, restart the application with the environment variable DEBUG=true to enable debug mode.');
  process.exit(1);
}