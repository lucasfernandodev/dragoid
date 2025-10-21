import { load } from 'cheerio'
import { BotError } from '../../../../../errors/bot-error.ts'
import type { IChapterData } from '../../../../../types/bot.ts'

export const collectChapter = (page: string) => {
  const $ = load(page)
  const data = { content: [] } as unknown as IChapterData

  const titleElement = $('#chapter h2 a.chr-title span').first()

  if (titleElement.length === 0 || !titleElement.text().trim()) {
    throw new BotError('Chapter extraction failed! Title not found.')
  }

  data.title = titleElement.text().trim()

  $('#chr-content p').each((_, el) => {
    const ph = $(el)
    const text = ph.text().trim()
    if (typeof text !== 'undefined' && text.length > 0) {
      if (!data.content) {
        data.content = [text]
      } else {
        data.content.push(text)
      }
    }
  })

  if (data.content.length === 0) {
    throw new BotError(
      'Chapter extraction failed! Paragraphs container not found'
    )
  }

  return {
    title: data.title,
    content: data.content,
  }
}
