import type { FastifyInstance } from "fastify";
import { listChapters } from "./list-chapters.ts";

export const apiNovelRoutes = async (app: FastifyInstance) => {
  await app.register(listChapters)
}