import { Route, Routes } from "react-router-dom"
import { HomePage } from "./pages/homepage/index.tsx"
import { ChapterPage } from "./pages/chapter/index.tsx"
import { NotFound } from "./pages/notfound/index.tsx"
import { OnlyChapter } from "./pages/only-chapter/index.tsx"
import { useContext } from "react"
import { ServerModeContext } from "./context/ServerMode/context.ts"
import { ServerOfflineTemplate } from "./components/templates/server-offline/index.tsx"

const NovelRouter = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chapter" element={<ChapterPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

const OnlyChapterRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<OnlyChapter />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export const Routers = () => {
  const { mode } = useContext(ServerModeContext);
  if (mode === 'offline') {
    return <ServerOfflineTemplate />
  }
  return mode === 'novel' ? <NovelRouter /> : <OnlyChapterRouter />
}