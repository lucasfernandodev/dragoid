import type { FastifyInstance } from "fastify"
import { ApplicationError } from "../../../../errors/application-error.ts"
import { hashString } from "../../../../utils/hash-string.ts"

export const getNovelWithChapterRouter = async (app: FastifyInstance) => {
  app.get('/api/novel/full', async (_, reply) => {

    if (!app?.novel) {
      throw new ApplicationError(
        "Chapters cannot be retrieved because novel data is not loaded.\
         Ensure that the novel file was successfully parsed before accessing this route."
      )
    }

    const novel = app?.novel

    const chapters = (app.novel.chapters || []).map((chapter, index) => {

      const content = chapter.content;

      const contentWidthId = content.map((content, index) => ({
        id: hashString(content + index),
        paragraph: content
      }))

      return {
        novelTitle: novel.title,
        title: chapter.title,
        content: contentWidthId,
        chapter_prev_id: (index - 1) < 0 ? null : index - 1,
        chapter_next_id: index + 1 > novel.chapters.length ? null : index + 1,
      }
    })

    reply.send({
      success: true,
      novel: {
        thumbnail: app.novel?.thumbnail,
        title: app.novel?.title,
        author: app.novel?.author,
        sinopse: app.novel?.description,
        status: app.novel?.status,
        source: app.novel?.source,
        language: app.novel?.language,
        chapters: chapters,
        qtdChapters: (app.novel?.chapters || []).length,
      }
    })
  })
}