import { z } from "zod"
import { chapterScheme } from "./chapter.ts"

export const novelSchema = z.object({
  thumbnail: z.string(),
  title: z.string(),
  author: z.array(z.string()),
  description: z.array(z.string()),
  chapters: z.array(chapterScheme),
  genres: z.array(z.string()),
  status: z.string(),
  language: z.string(),
}).strict()

export const novelFileSchema = z.object({
  thumbnail: z.string().optional(),
  title: z.string().optional(),
  author: z.array(z.string()).optional(),
  description: z.array(z.string()).optional(),
  chapters: z.array(chapterScheme).optional(),
  genres: z.array(z.string()).optional(),
  status: z.string().optional(),
  language: z.string().optional(),
}).strict()