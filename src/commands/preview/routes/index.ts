import type { FastifyInstance } from "fastify";
import { FAVICON_PATH } from "../../../core/configurations.ts";



export async function indexRoutes(app: FastifyInstance){
  app.register(function (instance, options, done) {
    instance.setNotFoundHandler(function (request, reply) {
      return reply.view("not-found.ejs", { favicon_path: FAVICON_PATH })
    })
    done()
  })



  app.get('/', async (request, reply) => {
    return reply.view("index.ejs", {
      title: app.novel.title,
      author: app.novel.author[0],
      chaptersQTD: app.novel.chapters.length,
      description: app.novel.description,
      chapterTitle: app.novel.chapters[0].title,
      chapterContent: app.novel.chapters[0].content,
      status: app.novel.status,
      language: app.novel.language,
      thumbnail: app.novel.thumbnail || '',
      chapter_next_id: app.novel.chapters.length > 1 ? 1 : null,
      favicon_path: FAVICON_PATH
    });
  })
}