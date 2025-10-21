export interface INovelData {
  title: string
  description: string[]
  genres: string[]
  author: string[]
  chapters: IChapterData[]
  status: string
  language: string
  thumbnail?: string
  source?: string
}

export interface INovelMeta {
  title: string
  description: string[]
  genres: string[]
  author: string[]
  source?: string
  thumbnail?: string
  language: string
  chapterList: string
  status: string
}

export interface IChapterData {
  title: string
  content: string[]
}

export type ChapterListItem = {
  title?: string
  url: string
}

export type ChapterList = ChapterListItem[]

export interface MultiDownloadChapterOptions {
  limit: number
  skip: number
  delay: number
}

export interface BotOptions {
  name: string
  help: {
    scraping_tool: string
    site: string
  }
  imageDownloader: (url: string, quality?: number) => Promise<string | null>
  collect: {
    novelInfo: (html: string) => INovelMeta
    chapterList: (html: string) => ChapterList
    chapter: (html: string) => IChapterData
  }
}

export abstract class Bot {
  public options!: BotOptions
  public getNovel!: (
    url: string,
    opt: Partial<MultiDownloadChapterOptions>
  ) => Promise<INovelData>
  public getChapter!: (url: string) => Promise<IChapterData>
  public getAllChapter!: (
    chapterList: ChapterList,
    opt: Partial<MultiDownloadChapterOptions>
  ) => Promise<IChapterData[]>
}
