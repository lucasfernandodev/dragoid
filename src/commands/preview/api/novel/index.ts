import type { FastifyInstance } from 'fastify'
import { getNovelRouter } from './get-novel.ts'
import { downloadNovelRouter } from './download-novel.ts'

export const ApiNovelRouter = async (app: FastifyInstance) => {
  await app.register(getNovelRouter)
  await app.register(downloadNovelRouter)
}
