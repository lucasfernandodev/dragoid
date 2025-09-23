import type { IChapter } from "../components/templates/homepage/default/index.tsx";

export const getFirstChapter = async () => {
  const response = await fetch('/api/chapter/?id=0');
  const data = await response.json();
  return data as { chapter: IChapter | null }
}