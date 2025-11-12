import type { FastifyInstance } from 'fastify'
import { getNovelRouteSchema } from './get-novel.schema.ts'

export const getNovelRouter = async (app: FastifyInstance) => {
  app.get('/api/novel', getNovelRouteSchema, async (_, reply) => {
    reply.send({
      success: true,
      novel: {
        thumbnail: app.novel?.thumbnail,
        title: app.novel?.title,
        author: app.novel?.author,
        sinopse: app.novel?.description,
        status: app.novel?.status,
        source: app.novel?.source,
        language: app.novel?.language,
        qtdChapters: (app.novel?.chapters || []).length,
      },
    })
  })
}
