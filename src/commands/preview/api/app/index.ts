import type { FastifyInstance } from 'fastify'
import { healCheckRouter } from './healt-check.ts'
import { getModeRouter } from './get-mode.ts'

export const ApiAppRouter = async (app: FastifyInstance) => {
  await app.register(healCheckRouter)
  await app.register(getModeRouter)
}
