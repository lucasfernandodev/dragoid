import { HomeDefaultSkeleton } from "../../components/shared/skeleton/home-default-skeleton/index.tsx"
import { HomepageDefaultTemplate, type INovel } from "../../components/templates/homepage/default/index.tsx"
import { useFetch } from "../../hooks/useFetch.ts"
import { LOCAL_STORAGE_KEYS } from "../../consts/local-storage.ts"
import { NovelsRepository } from "../../infra/repository/novels-repository.ts"
import { DatabaseIdb } from "../../infra/database.ts"
import { _fetch } from "../../utils/fetch.ts"
import { getNovel } from "../../api/get-novel.ts"
import { useBrowserLibraryManager } from "../../hooks/library-offline-manager.ts"

export const HomePage = () => {

  const { findOneBook } = useBrowserLibraryManager()

  const { isLoading, data } = useFetch({
    queryKey: ['getNovel'],
    queryFn: async () => {
      const isReadingTitle = window.localStorage.getItem(LOCAL_STORAGE_KEYS.currentNovelReading);
      console.log(isReadingTitle)

      if (!isReadingTitle) {
        return await getNovel()
      }

      const result = await findOneBook(isReadingTitle);
      if (!result.success || !result.data) {
        window.localStorage.removeItem(LOCAL_STORAGE_KEYS.currentNovelReading);
        console.log(await getNovel())
        return await getNovel()
      }

      const data = result.data || null;
      return { novel: data }
    }
  })

  if (isLoading) return <HomeDefaultSkeleton />

  if (!data?.novel) {
    return (
      <>
        Novel not found...
      </>
    )
  }

  return <HomepageDefaultTemplate novel={data.novel} />
}