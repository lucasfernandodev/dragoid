import z from 'zod'
import { ApiResponseSuccess } from '../../../../core/schemas/api-response.ts'

const response = ApiResponseSuccess.extend({
  title: z.string().min(1),
  chapterList: z.array(
    z.object({
      id: z.number(),
      title: z.string().min(1),
    })
  ),
})

export const getListChaptersRouteSchema = {
  schema: {
    response: {
      200: response,
    },
  },
}
