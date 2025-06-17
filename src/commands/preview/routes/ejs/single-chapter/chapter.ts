import type { FastifyInstance } from "fastify"; 
import { FAVICON_PATH } from "../../../../../core/configurations.ts";
import { ApplicationError } from "../../../../../errors/application-error.ts";



export async function readerSingleChapter(app: FastifyInstance){
  app.register(function (instance, options, done) {
    instance.setNotFoundHandler(function (request, reply) {
      return reply.view("not-found.ejs", { favicon_path: FAVICON_PATH })
    })
    done()
  })


  app.get('/', async (request, reply) => {

    if (!app?.chapter) {
      throw new ApplicationError(
        "Chapter page cannot be retrieved because chapter data is not loaded.\
         Ensure that the chapter file was successfully parsed before accessing this route."
      )
    }
    
    return reply.view("single-chapter.ejs", {
      title: app.chapter.title,
      content: app.chapter.content,
      favicon_path: FAVICON_PATH
    });
  })
}