import { ServerModeContext } from "./context.ts"
import type { ReactNode } from "react"
import { useFetch } from "../../hooks/useFetch.ts"
import { AppLoading } from "../../components/templates/AppLoading/index.tsx"

export const ServerModeProvider = ({ children }: { children: ReactNode }) => {

  const { data, isLoading, success, errorMessage } = useFetch({
    queryFn: async () => {
      const response = await fetch('/api/mode');
      const result = await response.json()
      return result;
    },
    queryKey: ['mode']
  })

  if (isLoading) {
    return <AppLoading />
  }

  if (!success && !isLoading) {
    console.log(errorMessage)
    return (
      <>
        <p>Get Server mode Failed</p>
        <p>{errorMessage as string}</p>
      </>
    )
  }

  return (
    <ServerModeContext.Provider value={{ mode: data?.mode === 'onlyChapter' ? 'onlyChapter' : 'novel' }}>
      {children}
    </ServerModeContext.Provider>
  )
}