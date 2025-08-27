import { createContext } from "react";
import type { ReplacementList } from "../../../types/front-end/replacement-list.ts";

export interface IReplacementListContext {
  getCollection: () => ReplacementList[]
  getList: (id: string) => ReplacementList | null;
  getActiveList: () => ReplacementList | null;
  toggleListActive: (id: string) => void;
  updateList: (id: string, data: ReplacementList['list']) => void;
  deleteList: (id: string) => void;
  addList: (id: string, data?: ReplacementList['list']) => void;
}

export const ReplacementListcontext = createContext<IReplacementListContext>(null!)