import type { IChapter } from "../components/templates/homepage/default/index.tsx";

export const getUniqueChapter = async ({ signal }: { signal?: AbortSignal }) => {
  const response = await fetch(`/api/chapter/unique`, { signal });
  const data = await response.json();
  return data as { chapter: IChapter | null }
}