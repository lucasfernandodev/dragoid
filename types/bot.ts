export interface INovelData {
  title: string
  description: string[]
  genres: string[];
  author: string[];
  chapters: IChapterData[];
  status: string;
  language: string;
  thumbnail?: string;
}

export interface IChapterData{
  title: string;
  content: string[];
}

/**
 * Web crawlers responsible for navigate to websites and download a novel or a single chapter
 */
export abstract class Bot{
  name: string;
  help: string;

  /**
   * Fetches novel data from the given URL.
   * @param {string} url - The URL of the novel page.
   * @returns {Promise<INovelData | null>} A promise resolving to novel data or null if not found.
   */
  getNovel: (url: string) => Promise<INovelData | null>

  /**
   * Fetches a single chapter from the given URL.
   * @param {string} url - The URL of the chapter page.
   * @returns {Promise<IChapterData | null>} A promise resolving to chapter data or null if not found.
   */
  getChapter: (url: string) => Promise<IChapterData | null>
}