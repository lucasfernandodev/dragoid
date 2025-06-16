import { logger } from './../utils/logger.ts';
import { ValidationError } from './validation-error.ts';
import { BotError } from './bot-error.ts';
import { ApplicationError } from './application-error.ts';
import { ZodError } from 'zod';

export const errorHandle = (error: any) => {
 
  if (error instanceof ApplicationError) {

    logger.error(`Application error: ${error?.message}`);

    if (process.env.DEBUG === 'true' && error?.debugMessage?.message) {
      const stack = error.debugMessage.stack
      logger.error(stack)
    }

    process.exit(error.exitCode)
  }

  if (error instanceof BotError) {
    logger.error(`Bot error: ${error?.message}`);

    if (process.env.DEBUG === 'true' && error?.debugMessage?.message) {
      const stack = error.debugMessage.stack
      logger.error(stack)
    }

    process.exit(error.exitCode)
  }

  if (error instanceof ValidationError) {
    logger.error(`Validation error: ${error?.message}`);

    if (process.env.DEBUG === 'true' && error?.debugMessage?.message) {
      const stack = error.debugMessage.stack
      logger.error(stack)
    }

    process.exit(error.exitCode)
  }

  if(error instanceof ZodError){
    const message = error.issues[0].message;
    logger.error(`Validation error: ${message}`);


    if (process.env.DEBUG === 'true') {
      logger.error(error);
    }

    process.exit(1)
  }


  if (process.env.DEBUG === 'true') {
    logger.error(error);
  }

  logger.error('\nAn unexpected error occurred. To view more details, restart the application with the environment variable DEBUG=true to enable debug mode.');
  process.exit(error?.exitCode || 1);
}