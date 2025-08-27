import { createContext } from "react";
import type { ChapterStyleProprerties } from "./provider.tsx";

export interface ChapterStyleContextProps {
  updateStyle: (options: Partial<ChapterStyleProprerties>) => void;
  openModal: () => void;
  closeModal: () => void;
  saveStyle: (style: ChapterStyleProprerties) => void;
  isOpen: boolean;
  style: ChapterStyleProprerties
}

export const ChapterStyleContext = createContext<ChapterStyleContextProps>(null!)