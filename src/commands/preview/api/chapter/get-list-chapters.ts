import type { FastifyInstance } from "fastify";
import { ApplicationError } from "../../../../errors/application-error.ts";

export const getListChaptersRouter = async (app: FastifyInstance) => {
  app.get('/api/chapter', async (_, reply) => {
    if (!app?.novel) {
      throw new ApplicationError(
        "Chapters cannot be retrieved because novel data is not loaded.\
         Ensure that the novel file was successfully parsed before accessing this route."
      )
    }

    return reply.send({
      success: true,
      title: app.novel.title,
      chapterList: app.novel.chapters.map((ch, index) => ({
        id: index,
        title: ch.title
      }))
    })
  })

}