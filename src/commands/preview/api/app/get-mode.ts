import type { FastifyInstance } from "fastify";
import { ApplicationError } from "../../../../errors/application-error.ts";

export const getModeRouter = async (app: FastifyInstance) => {
  app.get("/api/mode", (_, reply) => {
    if (app.mode !== 'novel' && app.mode !== 'onlyChapter') {
      throw new ApplicationError(
        `Setting front-end environment mode error! Mode ${app.mode} is invalid`
      )
    }

    return reply.send({
      success: true,
      mode: app.mode
    })
  })
}