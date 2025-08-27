import { z } from "zod";

export const getChapterScheme = z.object({
  id: z.coerce.number().min(0, {message: 'Chapter id invalid'})
})