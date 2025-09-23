import { useEffect, useRef } from 'react';
import S from './style.module.css';
import { useFetch } from '../../../../hooks/useFetch.ts';
import { IconExternalLink } from '@tabler/icons-react'
import { ChapterContent } from '../../../shared/chapter-content/index.tsx';
import { ChapterNavigation } from '../../../shared/chapter-navigation/index.tsx';
import { AppMenu } from '../../../shared/app-menu/index.tsx';
import { App } from '../../../atoms/App/index.tsx';
import type { FC } from '../../../../../types/front-end/fc.ts';
import { Loading } from '../../../shared/loading/index.tsx';
import { getFirstChapter } from '../../../../api/get-first-chapter.ts';
import { LOCAL_STORAGE_KEYS } from '../../../../consts/local-storage.ts';
import { useBrowserLibraryManager } from '../../../../hooks/library-offline-manager.ts';

export interface INovel {
  thumbnail: string;
  title: string;
  author: string[];
  sinopse: string[];
  status: string;
  qtdChapters: number;
  source: string
  language: string
}

export interface IChapterContent {
  id: string;
  paragraph: string
}

export interface IChapter {
  novelTitle: string;
  id: number;
  title: string;
  content: IChapterContent[];
  chapter_prev_id: number | null;
  chapter_next_id: number | null
}


interface HomeDefaultProps {
  novel: INovel
}

const Chapter = ({ ref }: { ref: React.RefObject<HTMLElement | null> }) => {

  const { findOneBook } = useBrowserLibraryManager()
  const { isLoading, data } = useFetch({
    queryKey: ['getFirstChapter'],
    queryFn: async () => {
      const isReadingTitle = window.localStorage.getItem(LOCAL_STORAGE_KEYS.currentNovelReading);

      if (!isReadingTitle) {
        return await getFirstChapter()
      }

      const result = await findOneBook(isReadingTitle);

      if (result.success && result.data) {
        return { chapter: result.data.chapters[0] }
      }
    }
  })

  if (isLoading) {
    return (
      <section className={S.chapter}>
        <Loading />
      </section>
    )
  }

  if (!data?.chapter) {
    return (
      <section className={S.chapter}>
        Chapter Notfound
      </section>
    )
  }

  const { chapter } = data;

  return (
    <section className={S.chapter}>
      <ChapterContent title={chapter.title} content={chapter.content} />
      <ChapterNavigation
        chapterId={0}
        next={chapter.chapter_next_id}
        prev={chapter.chapter_prev_id}
      />
      <AppMenu
        chapterId={0}
        target={ref}
        prev={chapter?.chapter_prev_id ?? null}
        next={chapter?.chapter_next_id ?? null}
      />
    </section>
  )
}

export const HomepageDefaultTemplate: FC<HomeDefaultProps> = ({
  novel
}) => {

  const chapterRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!novel?.title || !novel?.title?.trim()) {
      console.log('Novel title is empty! Unable to register the current novel being read')
    }

    window.localStorage.currentNovel = novel.title
  }, [novel?.title])

  return (
    <App className={S.app} appTitle={`Dragoid | ${novel.title}`} ref={chapterRef}>
      <section className={S.app_thumbnail}>
        <div className={S.thumbnail}>
          <img src={`data:image/jpeg;base64,${novel.thumbnail}`} alt={novel.title} />
        </div>
        <h1 className={S.title}>{novel.title}</h1>
        <p className={S.author}>{novel.author.map(a => (<span key={a}>{a}</span>))}</p>
        <ul className={S.book_details}>
          <li><h3>Status</h3><span>{novel.status}</span></li>
          <li><h3>Chapter</h3><span>{novel.qtdChapters}</span></li>
          <li><h3>Language</h3><span>{novel.language}</span></li>
        </ul>
        <div className={S.sinopse}>
          {novel.sinopse.map((t, index) => (<p key={index}>{t}</p>))}
        </div>
        <a href={novel.source} className={S.source_link}>
          <IconExternalLink />
          <span>
            Source
          </span>
        </a>
      </section>
      <Chapter ref={chapterRef} />
    </App>
  )
}