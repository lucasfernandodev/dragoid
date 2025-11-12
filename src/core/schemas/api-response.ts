import z from 'zod'

export const ApiResponseSuccess = z.object({
  success: z.boolean(),
})

export const ApiResponseError = z.object({
  success: z.boolean(),
  error: z.object({
    message: z.string().min(1),
    title: z.string().optional(),
  }),
})
