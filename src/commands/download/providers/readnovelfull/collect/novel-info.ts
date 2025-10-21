import { load } from 'cheerio'
import type { INovelMeta } from '../../../../../types/bot.ts'
import { BotError } from '../../../../../errors/bot-error.ts'

export const collectNovelInfo = (page: string): INovelMeta => {
  const $ = load(page)
  const parsed = {
    description: [],
    author: [],
    genres: [],
  } as unknown as INovelMeta

  // Thumbnail - Check if exist
  if ($('.books .book img').first().length > 0) {
    const image = $('.books .book img').first()
    const url = image.attr('src')
    if (url) {
      parsed.thumbnail = url
    }
  }

  // Title
  if ($('.desc h3.title[itemprop="name"]').first().length > 0) {
    const title = $('h3.title').first().text().trim()
    if (title) {
      parsed.title = title
    }
  }

  // Description
  $('.desc-text[itemprop="description"] p').each((_, el) => {
    const ph = $(el)
    const text = ph.text()
    if (!text.trim()) return
    if (text.includes('\n')) {
      text.split('\n').map((ph) => {
        if (ph.trim()) {
          parsed.description.push(ph.trim())
        }
      })
      return
    }

    parsed.description.push(text.trim())
  })

  // Genres
  $('meta[itemprop="genre"]').each((_, el) => {
    const content = $(el).attr('content')
    if (content?.trim() && content.includes('/')) {
      const parsedUrl = content.split('/')
      const genre = parsedUrl[parsedUrl.length - 1]
      if (genre.trim()) {
        parsed.genres?.push(genre.trim().toLowerCase())
      }
    }
  })

  // Authors
  $('span[itemprop="author"] meta[itemprop="name"]').each((_, el) => {
    const content = $(el).attr('content')
    if (content?.trim()) {
      parsed.author?.push(content)
    }
  })

  // Status
  $('ul.info li').each((_, el) => {
    const itemTitle = $(el).children('h3').text()
    if (itemTitle.trim() === 'Status:') {
      const status = $(el).children('a').first().text()
      if (status.trim()) {
        parsed.status = status.trim().toLowerCase()
      }
    }
  })

  // ChapterList
  if ($('[data-novel-id]').first().length > 0) {
    const id = $('[data-novel-id]').first().attr('data-novel-id')?.trim()
    if (id) {
      const url = `https://readnovelfull.com/ajax/chapter-archive?novelId=${id}`
      parsed.chapterList = url
    }
  }

  if (!parsed.title) {
    throw new BotError('Novel information extraction failed! Title not found.')
  }

  return {
    language: 'English',
    thumbnail: parsed.thumbnail,
    title: parsed.title,
    description: parsed.description,
    genres: parsed.genres,
    author: parsed.author,
    status: parsed.status,
    chapterList: parsed.chapterList,
  }
}
