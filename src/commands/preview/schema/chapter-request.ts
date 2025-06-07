import { z } from "zod";

export const chapterRequestSchema = z.object({
  id: z.coerce.number().min(0)
})