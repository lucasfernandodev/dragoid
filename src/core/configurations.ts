import path from 'node:path'

export const outputSupported = {
  novel: ['json', 'epub', 'txt'],
  chapter: ['json', 'txt'],
} as const

export const language = 'en'

declare const __IS_BUILD__: boolean
export const isProd =
  typeof __IS_BUILD__ !== 'undefined'
    ? __IS_BUILD__
    : process.env.IS_BUILD === 'true'
export const TEST_ASSETS_HTML_PATH = path.resolve(
  process.cwd(),
  'tests',
  'assets',
  'html'
)
