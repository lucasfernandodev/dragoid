import { load } from 'cheerio'
import type { IChapterData } from '../../../../../types/bot.ts'
import { BotError } from '../../../../../errors/bot-error.ts'

export const collectChapter = (page: string) => {
  const $ = load(page)
  const data = { content: [] } as unknown as IChapterData

  const title = $('.chr-title span').first()
  if (title.length === 0 || !title.text()) {
    throw new BotError('Chapter extraction failed! Title not found.')
  }

  data.title = title.text()

  $('#chr-content p').each((_, el) => {
    const ph = $(el)
    const text = ph.text()
    if (!text.trim()) return
    data.content.push(text)
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
