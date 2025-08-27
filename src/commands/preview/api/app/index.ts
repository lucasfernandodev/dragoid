import type { FastifyInstance } from "fastify";
import { healCheckRouter } from "./healt-check.ts";

export const ApiAppRouter = async (app: FastifyInstance) => {
  await app.register(healCheckRouter);
}