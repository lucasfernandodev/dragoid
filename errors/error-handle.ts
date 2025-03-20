import { logger } from './../utils/logger.ts';
import { ValidationError } from './validation-error.ts';
import { BotError } from './bot-error.ts';
import { ApplicationError } from './application-error.ts';

export const errorHandle = (error: any) => {
  if (error instanceof ApplicationError) {
    if (process.env.DEBUG === 'true') {
      logger.error(error?.debugMessage?.message || '');
    }

    logger.error(error.message);
    process.exit(error.exitCode)
  }

  if (error instanceof BotError) {
    if (process.env.DEBUG === 'true') {
      logger.error(error?.debugMessage?.message || '');
    }

    logger.error(error.message);
    process.exit(error.exitCode)
  }

  if (error instanceof ValidationError) {
    if (process.env.DEBUG === 'true') {
      logger.error(error?.debugMessage?.message || '');
    }

    logger.error(error.message);
    process.exit(error.exitCode)
  }


  if (process.env.DEBUG === 'true') {
    logger.error(error);
  }

  logger.error('An unexpected error occurred. To view more details, restart the application with the environment variable DEBUT=true to enable debug mode.');
  process.exit(error?.exitCode || 1);
}