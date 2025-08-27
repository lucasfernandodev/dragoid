import { useSearchParams } from "react-router-dom"
import { ChapterTemplateDefault } from "../../components/templates/chapter/default/index.tsx";
import { ChapterNotFound } from "../../components/templates/chapter/notfound/index.tsx";
import { useEffect, useState } from "react";
import { useFetch } from "../../hooks/useFetch.ts";
import type { IChapter } from "../../components/templates/homepage/default/index.tsx";
import { SkeletonChapter } from "../../components/shared/skeleton/index.tsx"; 

const isNumber = (n: unknown) => {
  if (typeof n !== 'number' && typeof n !== 'string') return false;
  return !isNaN(Number.parseInt(n as string))
}

export const ChapterPage = () => {
  const [parms] = useSearchParams()
  const id = parms.get('id');

  const [chapter, setChapter] = useState<null | IChapter>(null);
  const [notFound, setNotFound] = useState(false);


  const { isLoading, data, success, errorMessage } = useFetch({
    queryKey: ['chapter', id],
    queryFn: async ({ signal }) => {  
      const response = await fetch(`/api/chapter/?id=${id}`, { signal });
      const data = await response.json(); 
      return data as { chapter: IChapter | null }
    },
    isEnabled: isNumber(id),
  })

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [id]);


  useEffect(() => {
    if (!isLoading && data) {
      if (data.chapter) {
        setChapter(data.chapter)
      } else {
        setNotFound(true)
      }
    }
  }, [isLoading, data])

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
      {chapter && <ChapterTemplateDefault chapter={{ ...chapter, id: Number.parseInt(id as string) }} />}
      {!chapter && notFound && <ChapterNotFound />}
    </>
  )
}