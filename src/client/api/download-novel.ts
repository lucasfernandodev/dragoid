import type { ApiError } from '../utils/has-api-error.ts'

interface Props {
  format: 'json' | 'epub'
}

export const downloadNovel = async ({ format }: Props) => {
  const response = await fetch(`/api/novel/download?format=${format}`)

  if (response.status !== 200) {
    const data = await response.json()
    return data as ApiError
  }

  const disposition = response.headers.get('Content-Disposition') || ''
  const match = disposition.match(/filename="(.+)"/)
  const filename = match
    ? match[1]
    : `download.${format === 'json' ? 'json' : 'epub'}`

  const blob = await response.blob()
  return { success: true, file: blob, filename }
}
