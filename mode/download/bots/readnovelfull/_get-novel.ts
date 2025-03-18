import axios from 'axios';
import { type INovelData } from "../../../../types/bot.ts";
import { type CheerioAPI, load } from 'cheerio';
import { readnovelfullGetChapter } from './_get-chapter.ts';
import { exitOnFetchError } from '../../../../utils/exitOnFetchError.ts';
import { delay } from '../../../../utils/delay.ts';
import { logger } from '../../../../utils/logger.ts';
import { downloadImage, processImageToBase64 } from '../../../../utils/images.ts';

function printProgress(current: unknown, total: unknown) {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(`[+] Downloaded ${current}/${total} chapters${current === total ? '\n' : ''}`);
}



export const readnovelfullGetNovel = async (url: string): Promise<INovelData> => {

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

  const getBookId = ($: CheerioAPI) => {
    return $('[data-novel-id]').first().attr('data-novel-id')
  }

  const getChapters = async (bookId?: string) => {

    if (!bookId) {
      logger.error('BookId Not Found', 1, true)
    }

    const chapterListBaseURL = 'https://readnovelfull.com/ajax/chapter-archive?novelId=';
    const response = await exitOnFetchError(async () => await axios.get(`${chapterListBaseURL}${bookId}`));
    const document = response?.data;
    const $ = load(document);
    const chapterList = $('.list-chapter li a').map((_, el) => ({
      title: $(el).text().trim(),
      url: `https://readnovelfull.com${$(el).attr('href')}`
    })).get() as { url: string, title: string }[];

    const chaptersData = [] as INovelData['chapters']
    let index = 0;
    for (const { url, title } of chapterList) {
      await delay(500)
      const chapter = await readnovelfullGetChapter(url);
      chaptersData.push(chapter)
      printProgress(index, chapterList.length - 1)
      index++
    }

    return chaptersData;
  }

  const getThumbnail = async ($: CheerioAPI) => {
    const imageURL = $('.books .book img').first().attr('src');
    if (!imageURL) return '<image-url>'

    const bufferImage = await downloadImage(imageURL);
    if (!bufferImage) return '<image-url>'

    const base64Image = await processImageToBase64(bufferImage);
    if (!base64Image) return '<image-url>'

    return base64Image
  }

  const response = await exitOnFetchError(async () => axios.get(url));
  const document = response?.data;
  const $ = load(document);



  return {
    title: getTitle($),
    author: getAuthor($),
    status: getStatus($),
    thumbnail: await getThumbnail($),
    chapters: await getChapters(getBookId($)),
    description: getDescription($),
    genres: getGenres($),
    language: 'english'
  }
}
