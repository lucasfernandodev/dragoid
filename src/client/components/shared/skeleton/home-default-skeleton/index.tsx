import { Skeleton } from '../index.tsx'
import S from './style.module.css'

export const HomeDefaultSkeleton = () => {
  return (
    <main className={S.app}>
      <div className={S.app_thumbnail}>
        <Skeleton className={S.thumbnail} />
        <Skeleton className={S.title} />
        <Skeleton className={S.author} />

        <ul className={S.book_details}>
          <li>
            <div className={S.label}>
              <Skeleton className={S.placeholder} />
            </div>
            <div className={S.value}>
              <Skeleton className={S.placeholder} />
            </div>
          </li>
          <li>
            <div className={S.label}>
              <Skeleton className={S.placeholder} />
            </div>
            <div className={S.value}>
              <Skeleton className={S.placeholder} />
            </div>
          </li>
          <li>
            <div className={S.label}>
              <Skeleton className={S.placeholder} />
            </div>
            <div className={S.value}>
              <Skeleton className={S.placeholder} />
            </div>
          </li>
        </ul>

        <div className={S.sinopse}>
          <Skeleton className={S.paragraph} />
          <Skeleton className={S.paragraph} />
          <Skeleton className={S.paragraph} />
        </div>
        <div className={S.source_link}>
          <Skeleton className={S.text} />
        </div>
      </div>
    </main>
  )
}
