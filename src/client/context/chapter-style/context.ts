import { createContext } from "react";
import type { ChapterStyleProperties } from "./provider.tsx";

export interface ChapterStyleContextProps {
  updateStyle: (options: Partial<ChapterStyleProperties>) => void;
  openModal: () => void;
  closeModal: () => void;
  saveStyle: (style: ChapterStyleProperties) => void;
  isOpen: boolean;
  style: ChapterStyleProperties
}

export const ChapterStyleContext = createContext<ChapterStyleContextProps>(null!)