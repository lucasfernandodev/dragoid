import type { FastifyInstance } from "fastify";
import { getNovelRouter } from "./get-novel.ts";
import { getNovelWithChapterRouter } from "./get-novel-with-chapter.ts";

export const ApiNovelRouter = async (app: FastifyInstance) => {
  await app.register(getNovelRouter);
  await app.register(getNovelWithChapterRouter)
} 