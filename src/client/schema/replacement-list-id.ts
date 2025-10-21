import { z } from 'zod'

export const replacementListIdSchema = z.object({
  id: z
    .string({
      required_error: 'Id is required',
    })
    .min(3, { message: 'Id must be at least 3 characters long.' })
    .max(255, { message: 'Id must be at most 255 characters long.' })
    .regex(/^[\p{L}0-9 _-]+$/u, {
      message:
        'Id may only contain letters, numbers, spaces, hyphens, and underscores.',
    }),
})
