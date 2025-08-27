import { useContext } from "react"
import { ChapterStyleContext } from "../context/chapter-style/context.ts"

export const useChapterStyle = () => {
  const context = useContext(ChapterStyleContext);
  return context;
}