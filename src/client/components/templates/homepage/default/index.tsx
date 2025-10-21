import { useRef } from 'react'
import S from './style.module.css'
import { IconExternalLink } from '@tabler/icons-react'
import { App } from '../../../atoms/App/index.tsx'
import type { FC } from '../../../../types/fc.ts'
import { FirstChapter } from '../../../organisms/first-chapter/index.tsx'
export interface INovel {
  thumbnail: string
  title: string
  author: string[]
  sinopse: string[]
  status: string
  qtdChapters: number
  source: string
  language: string
}

export interface IChapterContent {
  id: string
  paragraph: string
}

export interface IChapter {
  novelTitle: string
  id: number
  title: string
  content: IChapterContent[]
  chapter_prev_id: number | null
  chapter_next_id: number | null
}

interface HomepageDefaultTemplateProps {
  book: INovel
}

export const HomepageDefaultTemplate: FC<HomepageDefaultTemplateProps> = ({
  book,
}) => {
  const chapterRef = useRef<HTMLElement>(null)

  return (
    <App
      className={S.app}
      appTitle={`Dragoid | ${book.title}`}
      ref={chapterRef}
    >
      <section className={S.app_thumbnail}>
        <div className={S.thumbnail}>
          <img
            src={`data:image/jpeg;base64,${book.thumbnail}`}
            alt={book.title}
          />
        </div>
        <h1 className={S.title}>{book.title}</h1>
        <p className={S.author}>
          {book.author.map((a) => (
            <span key={a}>{a}</span>
          ))}
        </p>
        <ul className={S.book_details}>
          <li>
            <h3>Status</h3>
            <span>{book.status}</span>
          </li>
          <li>
            <h3>Chapter</h3>
            <span>{book.qtdChapters}</span>
          </li>
          <li>
            <h3>Language</h3>
            <span>{book.language}</span>
          </li>
        </ul>
        <div className={S.sinopse}>
          {book.sinopse.map((t, index) => (
            <p key={index}>{t}</p>
          ))}
        </div>
        <a href={book.source} className={S.source_link}>
          <IconExternalLink />
          <span>Source</span>
        </a>
      </section>
      <FirstChapter appMenuRef={chapterRef} />
    </App>
  )
}
