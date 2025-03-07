import { type INovelData } from './../../types/bot.ts';
import Fastify, { type FastifyInstance } from "fastify";
import fastifyView from '@fastify/view';
import fastifyStaticFiles from '@fastify/static';
import ejs from 'ejs'
import path from 'path';
import { logger } from '../../utils/logger.ts';

export class Server {
  private PORT = 3010;
  private fastify: FastifyInstance;
  private data: INovelData

  constructor(data: INovelData) {
    this.fastify = Fastify({
      logger: false
    })
    this.fastify.register(fastifyView, {
      engine: {
        ejs
      }
    })
    this.fastify.register(fastifyStaticFiles, {
      root: path.join(import.meta.dirname, "/client/assets"),
      prefix: "/assets/",
    })
    this.data = data;
    logger.info(`[*] Server is Running in port: ${this.PORT}`)
  }

  private routers = async () => {
    // index
    this.fastify.get('/', async (request, reply) => {
      return reply.view("/mode/web-preview/client/index.ejs", {
        title: this.data.title,
        author: this.data.author[0],
        chaptersQTD: this.data.chapters.length,
        description: this.data.description,
        chapterTitle: this.data.chapters[0].title,
        chapterContent: this.data.chapters[0].content
      });
    })

    this.fastify.get('/chapter/:id', async (req, reply) => {
      const query = req.query as { id: string }
      const currentid = Number.parseInt(query.id);
      const nextId = currentid + 1 >= this.data.chapters.length ? null : currentid + 1;

      return reply.view("/mode/web-preview/client/chapter.ejs", {
        title: this.data.chapters[currentid].title,
        content: this.data.chapters[currentid].content,
        chapter_prev_id: currentid - 1,
        chapter_next_id: nextId,
      })
    })
  }

  public init = async () => {
    try {
      await this.routers()
      await this.fastify.listen({ host: '0.0.0.0', port: this.PORT })
    } catch (err) {
      this.fastify.log.error(err)
      process.exit(1)
    }
  }
}