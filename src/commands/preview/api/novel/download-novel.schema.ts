import z from 'zod'
import { ApiResponseError } from '../../../../core/schemas/api-response.ts'

const schema = z
  .object({
    format: z.enum(['epub', 'json'], {
      error: 'Download format invalid. Accept only epub or json',
    }),
  })
  .strict()

export const downloadNovelRouteSchema = {
  schema: {
    querystring: schema,
    response: {
      200: z.string(),
      400: ApiResponseError,
    },
  },
}
