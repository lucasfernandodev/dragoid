import type { FastifyInstance } from "fastify";
import { chapterRequestSchema } from "../schema/chapter-request.ts";
import { FAVICON_PATH } from "../../../core/configurations.ts";

export async function chapterRoutes(app: FastifyInstance){
  app.get('/chapter/:id', async (req, reply) => {
    const query = req.query as { id: string }
    const validateQuery = chapterRequestSchema.safeParse(query);
    const chapterListLength = app.novel.chapters.length

    if (!validateQuery.success) {
      return reply.callNotFound()
    }

    const currentid = validateQuery.data.id

    if (currentid >= chapterListLength) {
      return reply.callNotFound()
    }

    const nextId = currentid + 1 >= chapterListLength ? null : currentid + 1;
    const prevId = currentid - 1 < 0 ? null : (currentid - 1)

    return reply.view("chapter.ejs", {
      title: app.novel.chapters[currentid].title,
      content: app.novel.chapters[currentid].content,
      chapter_prev_id: prevId,
      chapter_next_id: nextId,
      favicon_path: FAVICON_PATH
    })
  })
}