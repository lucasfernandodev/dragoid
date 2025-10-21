import S from './style.module.css'

interface SkeletonLoading {
  isLoading: boolean
}

export const Skeleton = ({ className }: { className?: string }) => {
  return <div className={[S.skeleton, className].join(' ')}></div>
}

export const SkeletonChapterListItens = () => {
  const itens = Array.from({ length: 25 }) as number[]

  return (
    <ul className={S.chapterListItems}>
      {itens.map((i, index) => (
        <Skeleton key={index} className={S.chapterListItem} />
      ))}
    </ul>
  )
}

export const SkeletonChapter = () => {
  return (
    <main className={S.chapter}>
      <div className={S.bredcrumb}>
        <Skeleton className={S.bredcrumb_text} />
        <Skeleton className={S.bredcrumb_text} />
      </div>
      <section className={S.content}>
        <div className={S.paragraph}>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
        <div className={S.paragraph}>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
        <div className={S.paragraph}>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
        <div className={S.paragraph}>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
        <div className={S.paragraph}>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
        <div className={S.paragraph}>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      </section>
    </main>
  )
}
