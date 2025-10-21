import type { FastifyInstance } from 'fastify'
import { ApplicationError } from '../../../../errors/application-error.ts'
import { hashString } from '../../../../utils/hash-string.ts'
import { getChapterScheme } from '../../../../core/schemas/api/get-chapter.ts'

export const getChapterRouter = async (app: FastifyInstance) => {
  app.get('/api/chapter/:id', async (req, reply) => {
    if (!app?.novel) {
      throw new ApplicationError(
        'Chapters cannot be retrieved because novel data is not loaded.\
         Ensure that the novel file was successfully parsed before accessing this route.'
      )
    }

    const query = req.query as { id: string }
    const { success, error, data } = getChapterScheme.safeParse(query)
    if (!success) {
      return reply
        .send({
          success: false,
          errorMessage: error.issues[0].message,
        })
        .code(400)
    }

    const chapterListLength = app.novel.chapters.length
    const currentid = data.id

    if (currentid >= chapterListLength) {
      return reply
        .send({
          success: false,
          errorMessage: 'Chapter not found',
        })
        .code(404)
    }

    const nextId = currentid + 1 >= chapterListLength ? null : currentid + 1
    const prevId = currentid - 1 < 0 ? null : currentid - 1

    const content = app.novel.chapters[currentid].content

    const contentWidthId = content.map((content, index) => ({
      id: hashString(content + index),
      paragraph: content,
    }))

    return reply.send({
      success: true,
      chapter: {
        novelTitle: app.novel.title,
        title: app.novel.chapters[currentid].title,
        content: contentWidthId,
        chapter_prev_id: prevId,
        chapter_next_id: nextId,
      },
    })
  })
}
