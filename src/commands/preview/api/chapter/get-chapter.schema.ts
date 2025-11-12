import { z } from 'zod'
import {
  ApiResponseError,
  ApiResponseSuccess,
} from '../../../../core/schemas/api-response.ts'

const getChapterScheme = z.object({
  id: z.coerce.number().min(0, { message: 'Chapter id invalid' }),
})

const response = ApiResponseSuccess.extend({
  chapter: z.object({
    novelTitle: z.string(),
    title: z.string(),
    content: z.array(
      z.object({
        id: z.string(),
        paragraph: z.string(),
      })
    ),
    chapter_prev_id: z.number().nullable(),
    chapter_next_id: z.number().nullable(),
  }),
})

export const getChapterRouteSchema = {
  schema: {
    querystring: getChapterScheme,
    response: {
      404: ApiResponseError,
      200: response,
    },
  },
}
