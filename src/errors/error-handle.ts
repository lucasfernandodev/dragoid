import { logger } from './../utils/logger.ts';
import { ValidationError } from './validation-error.ts';
import { BotError } from './bot-error.ts';
import { ApplicationError } from './application-error.ts';
import { ZodError } from 'zod';

const printStackError = (error: unknown) => {
  if (process.env.DEBUG !== 'true') return;
  if (error instanceof Error) {
    const stack = error.stack || 'stack not found';
    logger.error(stack)
  }

  if (error !== null && typeof error === 'object') {
    if ('stack' in error) {
      const stack = error?.stack || 'stack not found';
      logger.error(stack as string)
    }
  }
}

export const errorHandle = (error: unknown) => {

  if (error instanceof ApplicationError) {

    logger.error(`Application error: ${error?.message}`);
    printStackError(error?.debugMessage)

    process.exit(error.exitCode)
  }

  if (error instanceof BotError) {
    logger.error(`Bot error: ${error?.message}`);
    printStackError(error?.debugMessage)

    process.exit(error.exitCode)
  }

  if (error instanceof ValidationError) {
    logger.error(`Validation error: ${error?.message}`);
    printStackError(error?.debugMessage)

    process.exit(error.exitCode)
  }

  if (error instanceof ZodError) {
    const message = error.issues[0].message;
    logger.error(`Validation error: ${message}`);


    if (process.env.DEBUG === 'true') {
      if (typeof error === 'string') {
        logger.error(error);
      } else {
        logger.error(JSON.stringify(error))
      }
    }

    process.exit(1)
  }


  if (process.env.DEBUG === 'true') {
    logger.error(error as string);
  }

  logger.error('\nAn unexpected error occurred. To view more details, restart the application with the environment variable DEBUG=true to enable debug mode.');
  process.exit(1);
}