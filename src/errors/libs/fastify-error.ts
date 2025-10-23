import fastify, { type FastifyReply, type FastifyRequest } from 'fastify'
import { ApplicationError } from '../application-error.ts'
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod'

export const fastifyError = (
  error: unknown | Error,
  _: FastifyRequest,
  reply: FastifyReply
) => {
  if (error instanceof ApplicationError) {
    return reply.code(500).send({
      success: false,
      error: {
        title: 'Application Error',
        message: error.message,
      },
    })
  }

  if (
    error instanceof fastify.errorCodes.FST_ERR_BAD_STATUS_CODE ||
    error instanceof fastify.errorCodes.FST_ERR_VALIDATION
  ) {
    return reply.code(400).send({
      success: false,
      error: {
        title: 'Bad Request',
        message: error.message,
      },
    })
  }

  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.code(400).send({
      success: false,
      error: {
        title: 'Invalid value',
        message: error.validation[0].message,
      },
    })
  }

  console.log(error)

  reply.send(error)
}
