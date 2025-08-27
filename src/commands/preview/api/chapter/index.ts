import type { FastifyInstance } from "fastify"; 
import { getListChaptersRouter } from "./get-list-chapters.ts";
import { getUniqueChapterRouter } from "./get-unique-chapter.ts";
import { getChapterRouter } from "./get-chapter.ts";

export const ApiChapterRouter = async (app: FastifyInstance) => {
  await app.register(getChapterRouter);
  await app.register(getListChaptersRouter);
  await app.register(getUniqueChapterRouter)
}