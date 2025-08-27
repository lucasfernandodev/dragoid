import { createContext } from "react";

interface ServerModeContext {
  mode: 'novel' | 'onlyChapter'
}

export const ServerModeContext = createContext<ServerModeContext>(null!)