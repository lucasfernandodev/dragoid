import { z } from "zod";

export const chapterScheme = z.object({
  title: z.string().min(1).max(270),
  content: z.array(z.string())
})

export type IChapterScheme = z.infer<typeof chapterScheme>