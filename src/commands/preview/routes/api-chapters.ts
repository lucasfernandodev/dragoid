import type { FastifyInstance } from "fastify";

export async function apiChaptersRoutes(app: FastifyInstance){
  app.get("/api/chapters", async (req, reply) => {
    return reply.send({
      chapters: app.novel.chapters.map((ch, index) => ({
        title: ch.title,
      }))
    })
  })
}