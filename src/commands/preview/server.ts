import { logger } from '../../utils/logger.ts';
import { fastifyInstance } from './../../lib/fastify.ts';
import { ApplicationError } from './../../errors/application-error.ts';
import type { IChapterData, INovelData } from '../../types/bot.ts';
import type { FastifyError, FastifyInstance } from 'fastify';
import { getLocalIPAddress } from '../../utils/get-local-ip.ts';
import chalk from 'chalk';
import fastifyVite from '@fastify/vite';
import { fileURLToPath } from 'url';
import path from 'path';
import { isBuild } from '../../core/configurations.ts';
import { ApiAppRouter } from './api/app/index.ts';
import { ApiChapterRouter } from './api/chapter/index.ts';
import { ApiNovelRouter } from './api/novel/index.ts';

interface ServerOptions {
  isPublic: boolean;
  port: number;
}


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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



export class Server {
  private fastify: FastifyInstance;
  private opt: ServerOptions = {
    isPublic: false,
    port: 3010
  }


  constructor({ files, opt }: IServer) {
    this.fastify = fastifyInstance(files)
    this.opt = { ...opt };
    if (files.chapter !== null) {
      this.settingClientEnvMode('onlyChapter')
    }

    if (files.novel !== null) {
      this.settingClientEnvMode('novel')
    }
  }

  private registerClientRouter = async () => {
    const devPath = path.resolve(__dirname, '..', '..', '..');
    await this.fastify.register(fastifyVite, {
      root: !isBuild ? devPath : __dirname, // where to look for vite.config.js
      dev: !isBuild,
      spa: true
    })

    this.fastify.get('/', (_, reply) => {
      return reply.html()
    })
  }

  private registerApiRouter = async () => {
    this.fastify.register(ApiAppRouter)
    this.fastify.register(ApiChapterRouter)
    this.fastify.register(ApiNovelRouter)

    this.fastify.get('/*', (req, reply) => {
      if (req.url.startsWith('/api/')) {
        return reply.callNotFound()
      }
      return reply.html()
    })
  }


  private handleRoutes = async () => {
    await this.registerClientRouter()
    await this.registerApiRouter()
  }


  private logStartup = () => {
    const urlLocal = `http://127.0.0.1:${this.opt.port}`;
    logger.info('[*] Server started successfully.');
    logger.info('[-] You can start reading your novel at the url:');
    logger.info(chalk.blueBright(urlLocal));
    if (this.opt.isPublic) {
      if (getLocalIPAddress()) {
        const ip = getLocalIPAddress();
        const port = this.opt.port
        logger.info(chalk.blueBright(`http://${ip}:${port}`))
      }
    }
  }

  private handleInitError = (err: FastifyError) => {
    if (err?.code === 'EADDRINUSE') {
      throw new ApplicationError(
        `Server initialization failed. Port ${this.opt.port} is already in use by another process.`,
        err
      )
    }

    throw new ApplicationError('Server initialization failed.', err)
  }


  private settingClientEnvMode = (mode: 'novel' | 'onlyChapter') => {
    if (mode !== 'novel' && mode !== 'onlyChapter') {
      throw new ApplicationError(
        `Setting front-end eviroment mode error! Mode ${mode} is invalid`
      )
    }

    process.env.VITE_APP_MODE = mode
  }

  private startServer = async () => {
    await this.handleRoutes();
    await this.fastify.vite.ready()
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
      this.handleInitError(err as FastifyError)
    }
  }
}