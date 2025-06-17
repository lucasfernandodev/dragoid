import ejs from 'ejs'
import fastifyStaticFiles from '@fastify/static';
import fastifyView from "@fastify/view";
import Fastify, { type FastifyInstance } from "fastify";
import path from "path";
import { fileURLToPath } from "url";
import type { IChapterData, INovelData } from '../types/bot.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

declare module 'fastify' {
  interface FastifyInstance {
    novel: import('../types/bot.ts').INovelData | null;
    chapter: import('../types/bot.ts').IChapterData | null;
  }
}

interface ReaderFiles {
  novel: null | INovelData;
  chapter: null | IChapterData;
}

/**
 * Custom instance of Fastify
 */
export const fastifyInstance = (files: ReaderFiles): FastifyInstance => {
  
  const app = Fastify({
    logger: false
  })

  app.decorate('chapter', files.chapter)
  app.decorate('novel', files.novel);

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