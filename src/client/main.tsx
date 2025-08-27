import './styles/reset.css';
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/homepage/index.tsx'
import { ChapterPage } from './pages/chapter/index.tsx'
import React from 'react';
import { ChapterStyleProvider } from './context/chapter-style/provider.tsx';
import { ReplacementListProvider } from './context/replacement-list/Provider.tsx';
import { NotFound } from './pages/notfound/index.tsx';
import { OnlyChapter } from './pages/only-chapter/index.tsx';

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

const root = createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <ChapterStyleProvider>
      <ReplacementListProvider>
        <BrowserRouter>
          {window.mode === 'novel' ? <NovelRouter /> : <OnlyChapterRouter />}
        </BrowserRouter>
      </ReplacementListProvider>
    </ChapterStyleProvider>
  </React.StrictMode>
)