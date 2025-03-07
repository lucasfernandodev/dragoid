import { z } from "zod"
import { chapterScheme } from "./chapter.ts"

export const novelSchema = z.object({
  title: z.string(),
  description: z.array(z.string()),
  chapters: z.array(chapterScheme),
  genres: z.array(z.string()),
  status: z.string(),
  language: z.string(),
})

export const novelWithDownloadInfo = z.object({
  filename: z.string().min(1).max(48),
  format: z.enum(['json', 'html']),
  novel: novelSchema
})