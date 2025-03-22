import { z } from "zod";

export const chapterScheme = z.object({
  title: z.string().min(1).max(100),
  content: z.array(z.string())
}).strict()