import { z } from 'zod'
import { chapterScheme } from './chapter.ts'

export const novelSchema = z
  .object({
    thumbnail: z.string(),
    title: z.string(),
    author: z.array(z.string()),
    description: z.array(z.string()),
    chapters: z.array(chapterScheme),
    genres: z.array(z.string()),
    status: z.string(),
    language: z.string(),
    source: z.string().url().optional(),
  })
  .strict()
