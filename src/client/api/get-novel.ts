import type { INovel } from "../components/templates/homepage/default/index.tsx";
import { _fetch } from "../utils/fetch.ts";

export const getNovel = async () => {
  const response = await _fetch('/api/novel');
  const data = await response.json();
  return data as { novel: INovel | null }
}