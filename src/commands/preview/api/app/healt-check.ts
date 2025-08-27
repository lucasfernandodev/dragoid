import type { FastifyInstance } from "fastify";

export const healCheckRouter = async (app: FastifyInstance) => {
  app.get('/api/healthcheck', async (_, reply) => {
    // You can add logic here to check database connections, external services, etc.
    // For a basic health check, simply return a success message.
    reply.send({ status: 'ok', message: 'API is healthy' });
  });
}