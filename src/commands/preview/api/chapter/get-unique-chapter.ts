import type { FastifyInstance } from "fastify";
import { ApplicationError } from "../../../../errors/application-error.ts";
import { hashString } from "../../../../utils/hash-string.ts";


export const getUniqueChapterRouter = async (app: FastifyInstance) => {
  app.get('/api/chapter/unique', async (_, reply) => {
    if (!app?.chapter) {
      throw new ApplicationError(
        "Chapter page cannot be retrieved because chapter data is not loaded.\
         Ensure that the chapter file was successfully parsed before accessing this route."
      )
    }

    const content = app.chapter.content;

    const contentWidthId = content.map((content, index) => ({
      id: hashString(content + index),
      paragraph: content
    }))

    return reply.send({
      success: true,
      chapter: {
        title: app.chapter.title,
        content: contentWidthId,
      }
    })
  })
}