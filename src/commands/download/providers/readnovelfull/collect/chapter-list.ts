import { load } from 'cheerio'
import type { ChapterList } from '../../../../../types/bot.ts'
import { BotError } from '../../../../../errors/bot-error.ts'

export const collectChapterList = (page: string): ChapterList => {
  const $ = load(page)
  const list = [] as ChapterList

  $('.list-chapter li a').each((_, el) => {
    const link = $(el)
    const url = link.attr('href')
    const title = link.attr('title') || link.text().trim()

    if (url && title) {
      list.push({
        title,
        url: `https://readnovelfull.com${url}`,
      })
    }
  })

  if (list.length === 0) {
    throw new BotError('Collect chapter list failed! Empty list')
  }

  return list
}
