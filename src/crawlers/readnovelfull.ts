import { load } from "cheerio";
import { exitsOnFechError, wating } from "../utils.ts";
import type { NovelOutput } from "../continue/cli.ts";

export const crawlerReadnovelfull = {
  name: 'readnovelfull',
  getNovel: async (url: string): Promise<NovelOutput> => {

   
      console.log('Starting Download Novel')

      const novelInfo = await exitsOnFechError(fetch(url));

      if (novelInfo.status !== 200) {
        console.error('Error! Unable to access the url, check if the url is correct and try again.')
        process.exit(1)
      }

      const $ = load(await novelInfo.text());

      const title = $('h3.title').first().text();
      const description = $('.desc-text[itemprop="description"]').first().text();
      const genres = (() => {
        const headers = $('ul.info li h3').filter((_, el) => $(el).text().trim() === 'Genre:');
        if (headers.length === 1) {
          const genreLabel = headers[0];
          const parent = genreLabel.parent || undefined;
          const genres = $(parent).find('a').map((_, el) => $(el).text()).get();
          return genres
        }
      })();
      const author = (() => {
        const headers = $('ul.info li h3').filter((_, el) => $(el).text().trim() === 'Author:');
        if (headers.length === 1) {
          const authorLabel = headers[0];
          const parent = authorLabel.parent || undefined;
          const genres = $(parent).find('a').map((_, el) => $(el).text()).get();
          return genres
        }
      })();

      // Get book id to fetch chapters list
      const bookId = $('[data-novel-id]').first().attr('data-novel-id');
      const fetchChapterLIST = await exitsOnFechError(fetch(`https://readnovelfull.com/ajax/chapter-archive?novelId=${bookId}`));
      const selectChapterHTML = load(await fetchChapterLIST.text());
      const chaptersList = selectChapterHTML('.list-chapter li a').map((_, el) => ({
        title: $(el).text().trim(),
        url: `https://readnovelfull.com${$(el).attr('href')}`
      })).get();

      const chaptersData = [] as NovelOutput['chapters'];

      for (const chapter of chaptersList) {

        const chapterPage = await exitsOnFechError(fetch(chapter.url));
        const $ = load(await chapterPage.text());
        const chapterTitle = $('.chr-title span').first().text();
        const chapterContent = $('#chr-content p').map((_, el) => $(el).text()).get();
        chaptersData.push({
          title: chapterTitle,
          content: chapterContent
        })

        await wating(1000)
        console.log(`+ Downloaded: ${chapter.title}`)
      }

      return {
        title,
        description,
        genres: genres || [],
        author: author || [],
        chapters: chaptersData
      }
   
  },


  getChapter: async (url: string) => {
    console.log('Starting Download Chapter');

    const chapterPage = await exitsOnFechError(fetch(url));
    const $ = load(await chapterPage.text());
    const chapterTitle = $('.chr-title span').first().text();
    const chapterContent = $('#chr-content p').map((_, el) => $(el).text()).get();

    if(chapterTitle.trim() === '') {
      console.error('Error! Unable to extract the chapter title, the url may be incorrect or the website may have been updated')
      process.exit(1)
    }
    return {
      title: chapterTitle,
      content: chapterContent
    }
  }
}

