import { useRef } from 'react'
import { useChapterStyle } from '../../../hooks/useChapterStyle.tsx'
import { useReplaceChapterContent } from '../../../hooks/useReplaceChapterContext.tsx'
import S from './style.module.css'
import type { IChapterContent } from '../../templates/homepage/default/index.tsx'

interface ChapterContentProps {
  title: string
  content: IChapterContent[]
}

export const ChapterContent = ({ title, content }: ChapterContentProps) => {
  const { style } = useChapterStyle()
  const chapterRef = useRef<HTMLDivElement>(null)
  useReplaceChapterContent({ targetRef: chapterRef })

  const chapterStyle = {
    ['--font-family' as string]: `${style.fontFamily}`,
    ['--line-height' as string]: `${style.lineHeight / 10}rem`,
    ['--paragraph-gap' as string]: `${style.paragraphGap / 10}rem`,
    ['--font-size' as string]: `${style.fontSize / 10}rem`,
  }

  return (
    <article className={S.chapter}>
      <div className={S.header}>
        <h2
          style={{
            fontSize: `${(style.fontSize + 10) / 10}rem`,
            lineHeight: `${((style.fontSize + 12) * 1.3) / 10}rem`,
          }}
        >
          {title}
        </h2>
      </div>
      <div className={S.content} style={chapterStyle} ref={chapterRef}>
        {content.map((ph) => {
          return (
            <p key={ph.id} className={S.paragraph}>
              {ph.paragraph}
            </p>
          )
        })}
      </div>
    </article>
  )
}
