import './styles/reset.css'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'
import { ChapterStyleProvider } from './context/chapter-style/provider.tsx'
import { ReplacementListProvider } from './context/replacement-list/Provider.tsx'
import { ServerModeProvider } from './context/ServerMode/provider.tsx'
import { Routers } from './routers.tsx'

const root = createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <ChapterStyleProvider>
      <ReplacementListProvider>
        <ServerModeProvider>
          <BrowserRouter>
            <Routers />
          </BrowserRouter>
        </ServerModeProvider>
      </ReplacementListProvider>
    </ChapterStyleProvider>
  </React.StrictMode>
)
