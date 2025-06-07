import { logger } from './../utils/logger.ts';
import { ValidationError } from './validation-error.ts';
import { BotError } from './bot-error.ts';
import { ApplicationError } from './application-error.ts';
import { ZodError } from 'zod';

export const errorHandle = (error: any) => {
  if (error instanceof ApplicationError) {
    if (process.env.DEBUG === 'true' && error?.debugMessage?.message) {
      logger.error(error?.debugMessage?.message || '');
    }

    logger.error(error.message);
    process.exit(error.exitCode)
  }

  if (error instanceof BotError) {
    if (process.env.DEBUG === 'true' && error?.debugMessage?.message) {
      logger.error(`[DEBUG] Bot error: ${error?.debugMessage?.message}` || '');
    }

    logger.error(error.message);
    process.exit(error.exitCode)
  }

  if (error instanceof ValidationError) {
    if (process.env.DEBUG === 'true' && error?.debugMessage?.message) {
      logger.error(`[DEBUG] Validation error: ${error?.debugMessage?.message}` || '');
    }

    logger.error(`Validation error: ${error?.message}`);
    process.exit(error.exitCode)
  }

  if(error instanceof ZodError){
    const message = error.issues[0].message;
    if (process.env.DEBUG === 'true') {
      logger.error(`[DEBUG] Validation error:\n`);
      logger.error(error);
    }

    logger.error(`Validation error: ${message}`);
    process.exit(1)
  }


  if (process.env.DEBUG === 'true') {
    logger.error(error);
  }

  logger.error('\nAn unexpected error occurred. To view more details, restart the application with the environment variable DEBUG=true to enable debug mode.');
  process.exit(error?.exitCode || 1);
}