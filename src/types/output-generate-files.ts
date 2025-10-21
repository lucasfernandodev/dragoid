import { outputSupported } from '../core/configurations.ts'
import type { IChapterData, INovelData } from './bot.ts'

// SupportedKeys = "novel" | "chapter"
type SupportedKeys = keyof typeof outputSupported

// generated dinamic type with outputSupported to generate output file;
export type OutputSupportedType = {
  [K in SupportedKeys]: {
    [F in (typeof outputSupported)[K][number]]: K extends 'novel'
      ? (filename: string, novel: INovelData, path?: string) => Promise<void>
      : K extends 'chapter'
        ? (
            filename: string,
            chapter: IChapterData,
            path?: string
          ) => Promise<void>
        : never
  }
}
