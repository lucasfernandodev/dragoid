import fastify, { type FastifyReply, type FastifyRequest } from 'fastify'
import { ApplicationError } from '../application-error.ts'
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod'
import { hasStatusCode } from '../../utils/has-status-code.ts'
import { ValidationError } from '../validation-error.ts'
import { logger } from '../../utils/logger.ts'

export const fastifyError = (
  error: unknown | Error,
  _: FastifyRequest,
  reply: FastifyReply
) => {
  if (error instanceof ApplicationError || error instanceof ValidationError) {
    return reply.code(500).send({
      success: false,
      error: {
        title: 'Server Error',
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

  if (hasStatusCode(error) && error.statusCode === 429) {
    return reply.code(429).send({
      success: false,
      error: {
        message: 'Rate limit exceeded, retry in 1 minute',
      },
    })
  }

  // Unknown Error
  logger.error('An unknown error has been found', error)

  return reply.code(500).send({
    success: false,
    error: {
      title: 'Unknown server error',
      message: 'An unknown error has been found',
    },
  })
}
