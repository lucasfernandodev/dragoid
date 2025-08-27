import { useContext } from "react"
import { ReplacementListcontext } from "../context/replacement-list/context.ts"

export const useReplacementList = () => {
  const context = useContext(ReplacementListcontext);
  return context;
}