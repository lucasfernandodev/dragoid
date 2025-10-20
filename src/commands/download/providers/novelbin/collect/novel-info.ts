import { load } from "cheerio";
import type { INovelMeta } from "../../../../../types/bot.ts";
import { BotError } from "../../../../../errors/bot-error.ts";

export const collectNovelInfo = (page: string): INovelMeta => {
  const $ = load(page);

  const parsed = { description: [], author: [], genres: [] } as unknown as INovelMeta

  const thumbnail = $('meta[property="og:image"]').attr('content') || ''
  if (thumbnail.trim().length > 0) {
    parsed.thumbnail = thumbnail
  }

  // get chapter list url
  const novelIdElement = $('[data-novel-id]').first()
  if (novelIdElement.length > 0 && novelIdElement.attr('data-novel-id')) {
    const id = novelIdElement.attr('data-novel-id')
    const params = `/ajax/chapter-archive?novelId=${id}`
    const canonicalLink = new URL($('link[rel="canonical"]').attr('href') || '')
    const hostname = canonicalLink.hostname;
    parsed.chapterList = `https://${hostname}${params}`
  }

  const titleElement = $('h3.title[itemprop="name"]').first();
  if (titleElement.length === 0 || !titleElement.text().trim()) {
    throw new BotError(
      'Novel information extraction failed! Title not found.'
    )
  }

  parsed.title = titleElement.text()

  // Description
  const descriptionConstainer = $('#tab-description .desc-text');
  if (descriptionConstainer.contents().length > 0) {
    descriptionConstainer.contents().each((_, el) => {
      const ph = $(el);
      const text = ph.text().trim();
      if (!text) return;
      if (text.includes('\n')) {
        parsed.description = text.split('\n').filter(t => t)
      } else {
        parsed.description.push(text)
      }
    })
  } else {
    const text = descriptionConstainer.text();
    if (text.trim()) {
      if (text.includes('\n')) {
        parsed.description = text.split('\n').filter(t => t)
      } else {
        parsed.description.push(text)
      }
    }
  }


  // genres
  const genres = $('meta[property="og:novel:genre"]').attr('content') || ''
  if (genres.trim().length !== 0) {
    if (genres.includes(',')) {
      parsed.genres = genres.split(',').map(g => g.trim().toLowerCase()).filter(g => g)
    } else {
      parsed.genres.push(genres.trim())
    }
  }

  // authors
  const authors = $('meta[property="og:novel:author"]').attr('content') || ''
  if (authors.trim().length !== 0) {
    if (authors.includes(',')) {
      parsed.author = authors.split(',').map(g => g.trim().toLowerCase()).filter(g => g)
    } else {
      parsed.author.push(authors.trim())
    }
  }

  // status
  const status = $('meta[property="og:novel:status"]').attr('content') || ''
  if (status.trim().length > 0) {
    parsed.status = status
  }


  return {
    thumbnail: parsed.thumbnail,
    language: 'English',
    chapterList: parsed.chapterList,
    title: parsed.title,
    description: parsed.description,
    genres: parsed.genres,
    author: parsed.author,
    status: parsed.status
  }
}