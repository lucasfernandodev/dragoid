import { useEffect, useRef, useState } from 'react';
import S from './style.module.css';
import { useFetch } from '../../../../hooks/useFetch.ts';
import { IconExternalLink } from '@tabler/icons-react'
import { ChapterContent } from '../../../shared/chapter-content/index.tsx';
import { ChapterNavigation } from '../../../shared/chapter-navigation/index.tsx';
import { AppMenu } from '../../../shared/app-menu/index.tsx';
import { HomeDefaultSkeleton } from '../../../shared/skeleton/home-default-skeleton/index.tsx';
import { App } from '../../../atoms/App/index.tsx';
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

export const HomepageDefaultTemplate = () => {

  const [novel, setNovel] = useState<INovel | null>(null);
  const [chapter, setChapter] = useState<IChapter | null>(null);
  const chapterRef = useRef<HTMLElement>(null)

  const getNovel = async () => {
    const response = await fetch('/api/novel');
    const data = await response.json();
    return data as { novel: INovel | null }
  }

  const getFirstChapter = async () => {
    const response = await fetch('/api/chapter/?id=0');
    const data = await response.json();
    return data as { chapter: IChapter | null }
  }

  const { isLoading, data } = useFetch({
    queryKey: ['getNovel'],
    queryFn: getNovel
  })



  useEffect(() => {
    if (!isLoading && data) {
      if (data?.novel) {
        setNovel(data.novel)
      }
    }
  }, [isLoading, data])

  const chapterResponse = useFetch({
    queryKey: ['getFirstChapter'],
    queryFn: getFirstChapter
  })

  useEffect(() => {
    if (!chapterResponse.isLoading && chapterResponse.data) {
      if (chapterResponse.data.chapter) {
        setChapter(chapterResponse.data.chapter)
      }
    }
  }, [chapterResponse])

  if (!novel || isLoading) {
    return <HomeDefaultSkeleton />
  }

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
      <section className={S.chapter}>
        {chapter && <ChapterContent title={chapter.title} content={chapter.content} />}
        {chapter && <ChapterNavigation
          chapterId={0}
          next={chapter.chapter_next_id}
          prev={chapter.chapter_prev_id}
        />}
        {<AppMenu
          chapterId={0}
          target={chapterRef}
          prev={chapter?.chapter_prev_id ?? null}
          next={chapter?.chapter_next_id ?? null}
        />}
      </section>
    </App>
  )
}