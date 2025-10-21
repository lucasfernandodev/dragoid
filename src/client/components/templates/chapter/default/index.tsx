import S from './style.module.css'
import { Link } from 'react-router-dom'
import { IconChevronRight } from '@tabler/icons-react'
import type { IChapter } from '../../homepage/default/index.tsx'
import { ChapterContent } from '../../../shared/chapter-content/index.tsx'
import { ChapterNavigation } from '../../../shared/chapter-navigation/index.tsx'
import { useEffect, useRef } from 'react'
import { AppMenu } from '../../../shared/app-menu/index.tsx'
import { useReadProgress } from '../../../../hooks/useReadProgress.tsx'
import { App } from '../../../atoms/App/index.tsx'

interface ChapterTemplateDefaultProps {
  chapter: IChapter
}

export const ChapterTemplateDefault = ({
  chapter,
}: ChapterTemplateDefaultProps) => {
  const chapterRef = useRef<HTMLDivElement>(null)
  const { updateHistory } = useReadProgress()

  useEffect(() => {
    if (!chapter) return
    const { novelTitle, title, id } = chapter
    updateHistory({ novelTitle, chapter: { title, id } })
  }, [chapter])

  return (
    <App
      appTitle={`Dragoid | ${chapter.title}`}
      className={S.chapter}
      ref={chapterRef}
    >
      <div className={S.bredcrumb}>
        <Link to="/">Homepage</Link>
        <IconChevronRight />
        <span>{chapter.title}</span>
      </div>
      <section className={S.content}>
        {chapter && (
          <ChapterContent title={chapter.title} content={chapter.content} />
        )}
        {chapter && (
          <ChapterNavigation
            chapterId={chapter.id}
            prev={chapter.chapter_prev_id}
            next={chapter.chapter_next_id}
          />
        )}
      </section>
      {
        <AppMenu
          chapterId={chapter.id}
          target={chapterRef}
          prev={chapter.chapter_prev_id}
          next={chapter.chapter_next_id}
        />
      }
    </App>
  )
}
