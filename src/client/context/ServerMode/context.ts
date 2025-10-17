import { createContext } from "react";

interface ServerModeContext {
  mode: 'novel' | 'onlyChapter' | 'offline'
}

export const ServerModeContext = createContext<ServerModeContext>(null!)