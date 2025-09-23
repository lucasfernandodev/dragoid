import { useEffect, useState } from "react";
import { useFetch } from "../../hooks/useFetch.ts";
import type { IChapter } from "../../components/templates/homepage/default/index.tsx";
import { SkeletonChapter } from "../../components/shared/skeleton/index.tsx";
import { ChapterNotFound } from "../../components/templates/chapter/notfound/index.tsx";
import { OnlyChapterTemplate } from "../../components/templates/only-chapter/index.tsx";
import { getUniqueChapter } from "../../api/get-unique-chapter.ts";

export const OnlyChapter = () => {

  const { isLoading, data, success, errorMessage } = useFetch({
    queryKey: ['chapter'],
    queryFn: getUniqueChapter,
  })


  if (isLoading) return <SkeletonChapter />

  if (!isLoading && !success && errorMessage) {
    return (
      <>
        Chapter Loading Failed: {errorMessage}
      </>
    )
  }

  return (
    <>
      {!data?.chapter && <ChapterNotFound />}
      {data?.chapter && <OnlyChapterTemplate chapter={data.chapter} />}
    </>
  )
}