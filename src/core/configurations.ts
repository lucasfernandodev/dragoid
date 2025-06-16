export const outputSupported = {
  novel: ['json', 'epub', 'txt'],
  chapter: ['json', 'txt']
} as const

export const language = 'en'

declare const __IS_BUILD__: boolean;
export const isBuild = typeof __IS_BUILD__ !== 'undefined' ? __IS_BUILD__ : process.env.IS_BUILD === 'true';
export const FAVICON_PATH = isBuild ? '/assets/img/icon.svg' : '/assets/img/icon-dev.svg'