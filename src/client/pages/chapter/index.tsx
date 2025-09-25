import { useSearchParams } from "react-router-dom"
import { ChapterTemplateDefault } from "../../components/templates/chapter/default/index.tsx";
import { ChapterNotFound } from "../../components/templates/chapter/notfound/index.tsx";
import { useEffect } from "react";
import { useFetch } from "../../hooks/useFetch.ts";
import type { IChapter } from "../../components/templates/homepage/default/index.tsx";
import { SkeletonChapter } from "../../components/shared/skeleton/index.tsx";
import { isNumber } from "../../utils/is-number.ts";
import { ChapterError } from "../../components/templates/chapter/Error/index.tsx";

export const ChapterPage = () => {

  const [params] = useSearchParams()
  const id = params.get('id');

  const { isLoading, success, errorMessage, data, } = useFetch({
    queryKey: ['chapter', id],
    queryFn: async ({ signal }) => {
      const response = await fetch(`/api/chapter/?id=${id}`);
      const data = await response.json();
      return data as { chapter: IChapter | null }
    },
    isEnabled: isNumber(id),
  })

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [id]);

  if (!isNumber(id)) {
    return <ChapterError
      title="Chapter loading error"
      description={'Id invalid. Check the chapter ID and try again.'}
    />
  }

  if (isLoading) return <SkeletonChapter />

  if (!isLoading && !success && errorMessage) {
    return <ChapterError
      title="Chapter request error"
      description={errorMessage as string}
    />
  }

  if (!data || !data.chapter) {
    return <ChapterNotFound />
  }

  return <ChapterTemplateDefault chapter={{ ...data.chapter, id: Number.parseInt(id as string) }} />
}