import type { FastifyInstance } from "fastify"; 
import { readerSingleChapter } from "./chapter.ts";

export const readerSingleChapterRoutes = async (app: FastifyInstance) => {
  await app.register(readerSingleChapter); 
}