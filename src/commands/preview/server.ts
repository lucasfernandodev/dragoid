import { fastifyInstance } from './../../lib/fastify.ts';
import { ApplicationError } from './../../errors/application-error.ts';
import { type INovelData } from '../../types/bot.ts';
import { logger } from '../../utils/logger.ts';
import type { FastifyInstance } from 'fastify';
import { chapterRoutes } from './routes/chapter.ts';
import { indexRoutes } from './routes/index.ts';
import { apiChaptersRoutes } from './routes/api-chapters.ts';
import { getLocalIPAddress } from '../../utils/get-local-ip.ts';

interface ServerOptions {
  isPublic: boolean;
  port: number;
}



export class Server {

  private fastify: FastifyInstance;
  private opt: ServerOptions = {
    isPublic: false,
    port: 3010
  }


  constructor(novel: INovelData, opt = {} as ServerOptions) {
    this.fastify = fastifyInstance(novel)
    this.opt = { ...opt };
  }

  private registerRoutes = async () => {
    this.fastify.register(async instance => {
      await indexRoutes(instance);
      await apiChaptersRoutes(instance);
      await chapterRoutes(instance);
    });
  }


  private logStartup = () => {
    const urlLocal = `http://127.0.0.1:${this.opt.port}`;
    logger.info('[*] Server started successfully.');
    logger.info('[-] You can start reading your novel at the url:');
    logger.info(urlLocal, 'blue');
    if (this.opt.isPublic) {
      const ip = getLocalIPAddress()
      ip && logger.info(`http://${ip}:${this.opt.port}`, 'blue');
    }
  }

  private handleInitError = (err: any) => {
    if (err?.code === 'EADDRINUSE') {
      throw new ApplicationError(
        `Server initialization failed. Port ${this.opt.port} is already in use by another process.`,
        err
      )
    }

    throw new ApplicationError('Server initialization failed.', err)
  }




  private startServer = async () => {
    await this.registerRoutes()
    await this.fastify.listen({
      host: this.opt.isPublic ? '0.0.0.0' : '127.0.0.1',
      port: this.opt.port
    });

    this.logStartup()
  }





  public init = async () => {
    try {
      await this.startServer()
    } catch (err) {
      this.handleInitError(err)
    }
  }
}