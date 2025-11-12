import { ApplicationError } from '../../../../errors/application-error.ts'
import { getChapterRouteSchema } from './get-chapter.schema.ts'
import type { FastifyTypedInstance } from '../../../../lib/fastify.ts'
import { hashString } from '../../../../utils/hash-string.ts'

export const getChapterRouter = async (app: FastifyTypedInstance) => {
  app.get('/api/chapter/:id', getChapterRouteSchema, async (req, reply) => {
    if (!app?.novel) {
      throw new ApplicationError(
        'Chapters cannot be retrieved because novel data is not loaded.\
         Ensure that the novel file was successfully parsed before accessing this route.'
      )
    }

    const { id: currentid } = req.query

    const chapterListLength = app.novel.chapters.length

    if (currentid >= chapterListLength) {
      return reply.code(404).send({
        success: false,
        error: {
          message: 'Chapter not found',
        },
      })
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
