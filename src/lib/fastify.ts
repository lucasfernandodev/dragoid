import ejs from 'ejs'
import fastifyStaticFiles from '@fastify/static';
import fastifyView from "@fastify/view";
import Fastify, { type FastifyInstance } from "fastify";
import path from "path";
import { fileURLToPath } from "url";
import type { INovelData } from '../types/bot.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

declare module 'fastify' {
  interface FastifyInstance {
    novel: import('../types/bot.ts').INovelData;
  }
}

/**
 * Custom instance of Fastify
 */
export const fastifyInstance = (data: INovelData): FastifyInstance => {
  
  const app = Fastify({
    logger: false
  })

  app.decorate('novel', data);

  // Loading EJS Files
  app.register(fastifyView, {
    engine: {
      ejs
    },
    root: path.join(__dirname, '../commands/preview/client')
  })


  // Loading static files
  app.register(fastifyStaticFiles, {
    root: path.join(__dirname, "../commands/preview/client/assets"),
    prefix: "/assets/",
  })

  return app
}