import z from 'zod'
import { ApiResponseSuccess } from '../../../../core/schemas/api-response.ts'

const response = ApiResponseSuccess.extend({
  novel: z.object({
    thumbnail: z.string().optional(),
    title: z.string(),
    author: z.array(z.string()),
    sinopse: z.array(z.string()),
    status: z.string(),
    source: z.string().optional(),
    language: z.string(),
    qtdChapters: z.number(),
  }),
})

export const getNovelRouteSchema = {
  schema: {
    response: {
      200: response,
    },
  },
}
