import { createHash } from 'node:crypto'

export const hashString = (str: string) => {
  const hash = createHash('md5')
  const result = hash.update(str).digest('hex')
  return result
}
