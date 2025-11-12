import z from 'zod'
import { ApiResponseSuccess } from '../../../../core/schemas/api-response.ts'

const response = ApiResponseSuccess.extend({
  title: z.string().min(1),
  chapter: z.object({
    title: z.string().min(1),
    chapter: z.array(
      z.object({
        id: z.string(),
        paragraph: z.string(),
      })
    ),
  }),
})

export const getUniqueChapterRouteSchema = {
  schema: {
    response: {
      200: response,
    },
  },
}
