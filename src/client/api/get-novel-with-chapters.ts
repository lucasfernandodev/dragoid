import type { IChapter, INovel } from "../components/templates/homepage/default/index.tsx";
import { _fetch } from "../utils/fetch.ts";

export interface INovelFull extends INovel {
  chapters: IChapter[]
}
export const getNovelWithChapters = async () => {
  const response = await _fetch('/api/novel/full');
  const data = await response.json();
  return data as { novel: INovelFull | null }
}