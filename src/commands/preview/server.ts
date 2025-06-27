import { logger } from '../../utils/logger.ts';
import { fastifyInstance } from './../../lib/fastify.ts';
import { ApplicationError } from './../../errors/application-error.ts';
import type { IChapterData, INovelData } from '../../types/bot.ts';
import type { FastifyInstance } from 'fastify';
import { readerNovelRoutes } from './routes/ejs/novel/index.ts';
import { getLocalIPAddress } from '../../utils/get-local-ip.ts';  
import { apiNovelRoutes } from './routes/api/novel/index.ts';
import { readerSingleChapterRoutes } from './routes/ejs/single-chapter/index.ts';
import chalk from 'chalk';

interface ServerOptions {
  isPublic: boolean;
  port: number;
}

type ServerRoutes  = 'novel' | 'chapter'

interface IServer {
  files: {
    novel: null | INovelData;
    chapter: null | IChapterData;
  };
  opt: {
    isPublic: boolean;
    port: number;
  }
}

export class Server {
  private routesTo: ServerRoutes = 'novel'
  private fastify: FastifyInstance;
  private opt: ServerOptions = {
    isPublic: false,
    port: 3010
  }


  constructor({ files, opt }: IServer) {
    this.fastify = fastifyInstance(files)
    this.opt = { ...opt };

    if (files.chapter) {
      this.routesTo = 'chapter'
    }
  }


  private registerNovelRoutes = async () => {
    this.fastify.register(readerNovelRoutes);
    this.fastify.register(apiNovelRoutes)
  }




  private registerSingleChapterRoutes = async () => {
    this.fastify.register(readerSingleChapterRoutes)
  }




  private handleRoutes = async () => {
    if (this.routesTo === 'chapter') {
      await this.registerSingleChapterRoutes()
    }

    if (this.routesTo === 'novel') {
      await this.registerNovelRoutes()
    }
  }


  private logStartup = () => {
    const urlLocal = `http://127.0.0.1:${this.opt.port}`;
    logger.info('[*] Server started successfully.');
    logger.info('[-] You can start reading your novel at the url:');
    logger.info(chalk.blueBright(urlLocal));
    if (this.opt.isPublic) {
      const ip = getLocalIPAddress()
      ip && logger.info(chalk.blueBright(`http://${ip}:${this.opt.port}`));
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
    await this.handleRoutes();
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