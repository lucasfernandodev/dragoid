import { useEffect, useState } from "react";
import { useFetch } from "../../hooks/useFetch.ts";
import type { IChapter } from "../../components/templates/homepage/default/index.tsx";
import { SkeletonChapter } from "../../components/shared/skeleton/index.tsx";
import { ChapterNotFound } from "../../components/templates/chapter/notfound/index.tsx";
import { OnlyChapterTemplate } from "../../components/templates/only-chapter/index.tsx";

export const OnlyChapter = () => {

  const { isLoading, data, success, errorMessage } = useFetch({
    queryKey: ['chapter'],
    queryFn: async ({ signal }) => {
      const response = await fetch(`/api/chapter/unique`, { signal });
      const data = await response.json();
      return data as { chapter: IChapter | null }
    },
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