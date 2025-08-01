import Fastify, { type FastifyInstance } from "fastify"; 
import type { IChapterData, INovelData } from '../types/bot.ts';  

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

   

  return app
}