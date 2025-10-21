import Fastify, { type FastifyInstance } from 'fastify'
import type { IChapterData, INovelData } from '../types/bot.ts'

declare module 'fastify' {
  interface FastifyInstance {
    novel: import('../types/bot.ts').INovelData | null
    chapter: import('../types/bot.ts').IChapterData | null
    mode: 'novel' | 'onlyChapter'
    isPublic: boolean
  }
}

interface ReaderFiles {
  novel: null | INovelData
  chapter: null | IChapterData
  mode: 'novel' | 'onlyChapter'
  isPublic: boolean
}

/**
 * Custom instance of Fastify
 */
export const fastifyInstance = (props: ReaderFiles): FastifyInstance => {
  const app = Fastify({
    logger: false,
  })

  app.decorate('chapter', props.chapter)
  app.decorate('novel', props.novel)
  app.decorate('mode', props.mode)
  app.decorate('isPublic', props.isPublic)

  return app
}
