import type { FastifyInstance } from 'fastify'
import { getModeRouter } from './get-mode.ts'

export const ApiAppRouter = async (app: FastifyInstance) => {
  await app.register(getModeRouter)
}
