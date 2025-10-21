import { HomeDefaultSkeleton } from '../../components/shared/skeleton/home-default-skeleton/index.tsx'
import {
  HomepageDefaultTemplate,
  type INovel,
} from '../../components/templates/homepage/default/index.tsx'
import { ServerOfflineTemplate } from '../../components/templates/server-offline/index.tsx'
import { useFetch } from '../../hooks/useFetch.ts'

export const HomePage = () => {
  const { isLoading, data } = useFetch({
    queryFn: async () => {
      const response = await fetch('/api/novel')
      const data = await response.json()
      return data as { novel: INovel | null }
    },
    queryKey: ['home-get-novel'],
  })

  if (isLoading) {
    return <HomeDefaultSkeleton />
  }

  if (!data || !data?.novel) {
    return <ServerOfflineTemplate />
  }

  return <HomepageDefaultTemplate book={data.novel} />
}
