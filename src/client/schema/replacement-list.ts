import { z } from 'zod'
import { replacementListIdSchema } from './replacement-list-id.ts'

export const replacementListScheme = replacementListIdSchema.extend({
  list: z.record(
    z
      .string()
      .min(1, { message: 'Source must be at least 1 character long' })
      .max(500, { message: 'Source must be at most 500 characters long' }),
    z
      .string()
      .min(1, { message: 'Target must be at least 1 character long' })
      .max(500, { message: 'Target must be at most 500 characters long' })
  ),
})
