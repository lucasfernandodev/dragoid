import { type INovelData } from '../../types/bot.ts';
import Fastify, { type FastifyInstance } from "fastify";
import fastifyView from '@fastify/view';
import fastifyStaticFiles from '@fastify/static';
import ejs from 'ejs'
import path from 'path';
import { logger } from '../../utils/logger.ts';

import { fileURLToPath } from 'url';
import { isNumber } from '../../utils/isNumber.ts';
import { getLocalIPAddress } from '../../utils/get-local-ip.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface IServerOptions {
  isPublic: boolean;
}

export class Server {
  private PORT = 3010;
  private fastify: FastifyInstance;
  private data: INovelData
  private opt: IServerOptions = {
    isPublic: false,
  }

  constructor(data: INovelData, opt: IServerOptions = {} as IServerOptions) {
    this.fastify = Fastify({
      logger: false,
    })
    this.fastify.register(fastifyView, {
      engine: {
        ejs
      },
      root: path.join(__dirname, 'client')
    })
    this.fastify.register(fastifyStaticFiles, {
      root: path.join(__dirname, "/client/assets"),
      prefix: "/assets/",
    })
    this.data = data;
    this.opt = {
      ...opt
    }

    if(this.opt.isPublic){
      const publicIp = getLocalIPAddress();
      logger.info('[*] Server started successfully.\n[-] You can start reading your novel at the url:')
      logger.info(`http://127.0.0.1:${this.PORT}`, 'blue')
      publicIp && logger.info(`http://${publicIp}:${this.PORT}`, 'blue')
    }else{
      logger.info('[*] Server started successfully.\n[-] You can start reading your novel at the url:')
      logger.info(`http://127.0.0.1:${this.PORT}`, 'blue')
    }
    
  }

  private routers = async () => {
    // index
    this.fastify.register(function (instance, options, done) {
      instance.setNotFoundHandler(function (request, reply) {
        return reply.view("not-found.ejs")
      })
      done()
    })


    this.fastify.get('/', async (request, reply) => {

      return reply.view("index.ejs", {
        title: this.data.title,
        author: this.data.author[0],
        chaptersQTD: this.data.chapters.length,
        description: this.data.description,
        chapterTitle: this.data.chapters[0].title,
        chapterContent: this.data.chapters[0].content,
        status: this.data.status,
        language: this.data.language,
        thumbnail: this.data.thumbnail || '',
        chapter_next_id: this.data.chapters.length > 1 ? 1 : null,
      });
    })



    this.fastify.get('/chapter/:id', async (req, reply) => {
      const query = req.query as { id: string }

      if (!isNumber(query?.id)) {
        return reply.callNotFound()
      }

      const currentid = Number.parseInt(query.id);

      if (currentid < 0 || currentid >= this.data.chapters.length) {
        return reply.callNotFound()
      }

      const nextId = currentid + 1 >= this.data.chapters.length ? null : currentid + 1;
      const prevId = currentid - 1 < 0 ? null : (currentid - 1)

      return reply.view("chapter.ejs", {
        title: this.data.chapters[currentid].title,
        content: this.data.chapters[currentid].content,
        chapter_prev_id: prevId,
        chapter_next_id: nextId,
      })
    })
  }

  public init = async () => {
    try {
      const host = this.opt.isPublic ? '0.0.0.0' : '127.0.0.1'
      await this.routers()
      await this.fastify.listen({ host: host, port: this.PORT })
    } catch (err) {
      this.fastify.log.error(err)
      process.exit(1)
    }
  }
}