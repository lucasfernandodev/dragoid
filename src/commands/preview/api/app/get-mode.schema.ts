import z from 'zod'
import { ApiResponseSuccess } from '../../../../core/schemas/api-response.ts'

const response = ApiResponseSuccess.extend({
  mode: z.enum(['novel', 'onlyChapter']),
})

export const getModeRouteSchema = {
  schema: {
    response: {
      200: response,
    },
  },
}
