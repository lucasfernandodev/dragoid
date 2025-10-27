import Fastify, {
  type FastifyBaseLogger,
  type FastifyInstance,
  type RawReplyDefaultExpression,
  type RawRequestDefaultExpression,
  type RawServerDefault,
} from 'fastify'
import type { IChapterData, INovelData } from '../types/bot.ts'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { fastifyError } from '../errors/libs/fastify-error.ts'

export type FastifyTypedInstance = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  FastifyBaseLogger,
  ZodTypeProvider
>

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

  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  app.decorate('chapter', props.chapter)
  app.decorate('novel', props.novel)
  app.decorate('mode', props.mode)
  app.decorate('isPublic', props.isPublic)

  app.setErrorHandler(fastifyError)

  return app
}
