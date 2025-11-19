import type { Response } from '../types/api-response.ts'

interface ReturnType {
  message?: string
  isPublic: boolean
  host: string
  qrcode: string
}

export const getNovelShareInfo = async () => {
  const response = await fetch('/api/novel/share')
  const json = await response.json()
  return json as Response<ReturnType>
}
