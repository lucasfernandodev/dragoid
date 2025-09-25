import type { FC } from '../../../../types/front-end/fc.ts';
import { App } from '../../atoms/App/index.tsx';
import type { IChapter } from '../homepage/default/index.tsx';
import S from './style.module.css';
import { AppMenu } from '../../shared/app-menu/index.tsx';
import { useRef } from 'react';
import { ChapterContent } from '../../shared/chapter-content/index.tsx';

interface ChapterTemplateDefaultProps {
  chapter: IChapter
}

export const OnlyChapterTemplate: FC<ChapterTemplateDefaultProps> = ({
  chapter
}) => {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <App appTitle={`Dragoid | ${chapter.title}`} className={S.chapter} ref={ref}>
      <section className={S.content}>
        {chapter && <ChapterContent title={chapter.title} content={chapter.content} />}
      </section>
      {<AppMenu
        target={ref}
        prev={null}
        next={null}
      />}
    </App>
  )
}