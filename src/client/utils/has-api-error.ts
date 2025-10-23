import z from 'zod'

const schema = z.object({
  success: z.boolean(),
  error: z.object({
    message: z.string(),
    title: z.string().optional(),
  }),
})

export type ApiError = z.infer<typeof schema>

export const hasApiError = (data: unknown): data is z.infer<typeof schema> => {
  const validate = schema.safeParse(data)
  return validate.success
}
