import z from 'zod'
import {
  ApiResponseError,
  ApiResponseSuccess,
} from '../../../../core/schemas/api-response.ts'

const response = ApiResponseSuccess.extend({
  data: z.object({
    isPublic: z.boolean(),
    message: z.string().optional(),
    host: z.string().optional(),
    qrcode: z.string().optional(),
  }),
})

export const getNovelShareInfoRouteSchema = {
  schema: {
    response: {
      200: response,
      500: ApiResponseError,
    },
  },
}
