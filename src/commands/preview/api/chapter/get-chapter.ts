import { ApplicationError } from '../../../../errors/application-error.ts'
import { getChapterScheme } from '../../../../core/schemas/api/get-chapter.ts'
import type { FastifyTypedInstance } from '../../../../lib/fastify.ts'
import { createHash } from 'crypto'

const validation = {
  schema: {
    querystring: getChapterScheme,
  },
}

export const getChapterRouter = async (app: FastifyTypedInstance) => {
  app.get('/api/chapter/:id', validation, async (req, reply) => {
    if (!app?.novel) {
      throw new ApplicationError(
        'Chapters cannot be retrieved because novel data is not loaded.\
         Ensure that the novel file was successfully parsed before accessing this route.'
      )
    }

    const { id: currentid } = req.query

    const chapterListLength = app.novel.chapters.length

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

    const hash = createHash('md5')

    const contentWidthId = content.map((content, index) => ({
      id: hash.update(content + index).digest('hex'),
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
