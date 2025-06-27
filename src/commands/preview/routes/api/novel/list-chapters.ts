import type { FastifyInstance } from "fastify";
import { ApplicationError } from "../../../../../errors/application-error.ts";

export async function listChapters(app: FastifyInstance) {
  app.get("/api/chapters", async (req, reply) => {
    if (!app?.novel) {
      throw new ApplicationError(
        "Chapters cannot be retrieved because novel data is not loaded.\
         Ensure that the novel file was successfully parsed before accessing this route."
      )
    }

    return reply.send({
      chapters: app.novel.chapters.map((ch) => ({
        title: ch.title,
      }))
    })
  })
}