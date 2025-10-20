import type { FastifyInstance } from "fastify";
import { healCheckRouter } from "./healt-check.ts";
import { getModeRouter } from "./get-mode.ts";
import { getNovelShareInfo } from "./get-novel-share-info.ts";

export const ApiAppRouter = async (app: FastifyInstance) => {
  await app.register(healCheckRouter);
  await app.register(getModeRouter)
  await app.register(getNovelShareInfo)
}