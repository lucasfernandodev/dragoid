import { useFetch } from '../../../hooks/useFetch.ts';
import { AppMenu } from '../../shared/app-menu/index.tsx';
import { ChapterContent } from '../../shared/chapter-content/index.tsx';
import { ChapterNavigation } from '../../shared/chapter-navigation/index.tsx';
import { Loading } from '../../shared/loading/index.tsx';
import type { IChapter } from '../../templates/homepage/default/index.tsx';
import S from './style.module.css';
import type { FC } from '../../../../types/front-end/fc.ts';

interface FirstChapterProps {
  appMenuRef: {
    current: HTMLElement | null
  }
}

export const FirstChapter: FC<FirstChapterProps> = ({ appMenuRef }) => {
  const { isLoading, data } = useFetch({
    queryKey: ['getFirstChapter'],
    queryFn: async () => {
      const response = await fetch('/api/chapter/?id=0');
      const data = await response.json();
      return data as { chapter: IChapter | null }
    }
  })

  if (isLoading) {
    return <Loading />
  }

  if (!data || !data?.chapter) {
    return <>Chapter Not found</>
  }

  const { chapter } = data;

  return (
    <section className={S.chapter}>
      {chapter && <ChapterContent title={chapter.title} content={chapter.content} />}
      {chapter && <ChapterNavigation
        chapterId={0}
        next={chapter.chapter_next_id}
        prev={chapter.chapter_prev_id}
      />}
      {<AppMenu
        chapterId={0}
        target={appMenuRef}
        prev={chapter?.chapter_prev_id ?? null}
        next={chapter?.chapter_next_id ?? null}
      />}
    </section>
  )
}