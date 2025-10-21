import { load } from 'cheerio'
import type { INovelMeta } from '../../../../../types/bot.ts'
import { BotError } from '../../../../../errors/bot-error.ts'

export const collectNovelInfo = (page: string): INovelMeta => {
  const $ = load(page)
  const titleElement = $('.booknav2 h1 a').first()
  const parsed = {
    author: [],
    description: [],
    genres: [],
  } as INovelMeta & object

  if (titleElement.length === 0) {
    throw new BotError('Novel information extraction failed! Title not found.')
  }

  parsed.title = titleElement.text()

  // Parse authors
  $('.booknav2 p a').each((_, el) => {
    const name = $(el).text()
    if (name.trim()) {
      parsed.author.push(name)
    }
  })

  // Sinopse
  $('.mybox .navtxt p').each((_, el) => {
    let currentTextRow = ''

    $(el)
      .contents()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .each((_, child: any) => {
        const isBrTag = child.type === 'tag' && child.name === 'br'

        if (isBrTag) {
          if (currentTextRow.trim()) {
            parsed.description.push(currentTextRow.trim())
            currentTextRow = ''
          }
        } else if (child.type === 'text') {
          currentTextRow += child.data || ''
        } else {
          currentTextRow += $(child).text()
        }
      })
  })

  // genres
  $('.booknav2 p').each((_, el) => {
    const text = $(el).text()
    if (!text.trim() || !text.includes('分类：')) return
    const genre = text.split('分类：')[1].trim()
    if (genre) {
      parsed.genres.push(genre)
    }
  })

  // Status
  $('.booknav2 p').each((_, el) => {
    const text = $(el).text()
    if (!text.trim() || !text.includes('|')) return
    const status = text.split('|')[1].trim()
    if (status) {
      parsed.status = status
    }
  })

  const thumbnail = $('.bookimg2 img').first()
  if (thumbnail.length > 0) {
    const url = thumbnail.attr('src')
    if (url) {
      parsed.thumbnail = url
    }
  }

  const chapterList = $('.addbtn .btn').first()
  if (chapterList.length > 0) {
    const href = chapterList.attr('href')
    if (href) {
      parsed.chapterList = href
    }
  }

  return {
    thumbnail: parsed.thumbnail,
    title: parsed.title,
    author: parsed.author,
    description: parsed.description,
    genres: parsed.genres,
    status: parsed.status,
    chapterList: parsed.chapterList,
    language: 'Chinese',
  }
}
