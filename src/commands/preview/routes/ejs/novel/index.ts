import type { FastifyInstance } from "fastify";
import { readerNovelHomepage } from "./homepage.ts";
import { readerNovelChapter } from "./chapter.ts";

export const readerNovelRoutes = async (app: FastifyInstance) => {
  await app.register(readerNovelHomepage);
  await app.register(readerNovelChapter)
}