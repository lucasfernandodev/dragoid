import { load } from 'cheerio'
import { BotError } from '../../../../../errors/bot-error.ts'

export const collectChapter = (page: string) => {
  const $ = load(page)
  const content: string[] = []

  const titleElement = $('h1').first()
  const containerParagraphs = $('.txtnav').first()

  if (titleElement.length === 0) {
    throw new BotError('Chapter extraction failed! Title not found.')
  }

  const title = titleElement.text()

  if (containerParagraphs.length === 0) {
    throw new BotError(
      'Chapter extraction failed! Paragraphs container not found'
    )
  }

  const nodes = containerParagraphs.contents()
  nodes.each((_, el) => {
    if (el === titleElement.get(0)) return

    if (el.type === 'text') {
      const text = $(el).text().trim()
      if (text) content.push(text)
    }
  })

  return {
    title,
    content,
  }
}
