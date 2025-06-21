import { ThumbnailProcessor } from './../../download-thumbnail.ts';
import axios from 'axios';
import { type CheerioAPI, load } from 'cheerio';
import { readnovelfullGetChapter } from './_get-chapter.ts';
import type { DownloadNovelOptions, INovelData } from '../../../types/bot.ts';
import { BotError } from '../../../errors/bot-error.ts';
import { processChaptersList } from '../../process-chapter-list.ts';


export const readnovelfullGetNovel = async (
  url: string,
  opt: DownloadNovelOptions = {}
): Promise<INovelData> => {

  const LANGUAGE = 'english'
  const SOURCE = url;

  const getThumbnail = async ($: CheerioAPI) => {
    const imageURL = $('.books .book img').first().attr('src');
    if (!imageURL) return '<image-url>'

    const thumbnailProcessor = new ThumbnailProcessor(imageURL)
    const thumbnail = await thumbnailProcessor.execute();
    return thumbnail
  }

  const getTitle = ($: CheerioAPI) => {
    return $('h3.title').first().text();
  }

  const getDescription = ($: CheerioAPI) => {
    return $('.desc-text[itemprop="description"]').first().text().split("\n");
  }

  const getGenres = ($: CheerioAPI) => {
    const headers = $('ul.info li h3').filter((_, el) => $(el).text().trim() === 'Genre:')
    if (headers.length === 1) {
      const genreLabel = headers[0];
      const parent = genreLabel.parent || undefined;
      const genres = $(parent).find('a').map((_, el) => $(el).text()).get();
      return genres
    }
    return []
  }

  const getAuthor = ($: CheerioAPI) => {
    const headers = $('ul.info li h3').filter((_, el) => $(el).text().trim() === 'Author:');
    if (headers.length === 1) {
      const authorLabel = headers[0];
      const parent = authorLabel.parent || undefined;
      const genres = $(parent).find('a').map((_, el) => $(el).text()).get();
      return genres
    }
    return []
  }

  const getStatus = ($: CheerioAPI) => {
    const headers = $('ul.info li h3').filter((_, el) => $(el).text().trim() === 'Status:');
    if (headers.length === 1) {
      const authorLabel = headers[0];
      const parent = authorLabel.parent || undefined;
      const status = $(parent).find('a').map((_, el) => $(el).text()).get();
      return status[0]
    }

    return 'unknown'
  }


  const getChapterId = ($: CheerioAPI) => {
    const bookId = $('[data-novel-id]').first().attr('data-novel-id')
    return bookId;
  }


  const getChaptersList = async (bookId?: string) => {
    if (!bookId) {
      throw new BotError('Unable to retrieve chapter list');
    }

    const pageUrl = `https://readnovelfull.com/ajax/chapter-archive?novelId=${bookId}`;
    const response = await axios.get(pageUrl)

    if (!('data' in response)) {
      throw new BotError('Retrive chapter list page failed!', response)
    }

    const $ = load(response.data);

    const chapterList = $('.list-chapter li a').map((_, el) => ({
      title: $(el).text().trim(),
      url: `https://readnovelfull.com${$(el).attr('href')}`
    })).get()

    return chapterList;
  }


  const getChapters = async ($: CheerioAPI) => {
    const chaptersData = [] as INovelData['chapters']
    const bookId = getChapterId($);
    const chaptersList = await getChaptersList(bookId)

    if (chaptersList.length < 1) {
      throw new BotError('Chapter list empty')
    }

    await processChaptersList(chaptersList, async ({ url }) => {
      const chapter = await readnovelfullGetChapter(url);
      chaptersData.push(chapter)
    }, opt)

    return chaptersData;
  }

  const response = await axios.get(url);

  if (!('data' in response)) {
    throw new BotError('Retrive novel page failed!', response)
  }

  const $ = load(response.data);

  return {
    title: getTitle($),
    author: getAuthor($),
    status: getStatus($),
    thumbnail: await getThumbnail($),
    chapters: await getChapters($),
    description: getDescription($),
    genres: getGenres($),
    language: LANGUAGE,
    source: SOURCE
  }
}
