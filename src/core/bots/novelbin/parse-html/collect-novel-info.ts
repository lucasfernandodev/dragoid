import type { INovelData } from "../../../../types/bot";

interface CollectDataReturn extends Omit<INovelData, 'language'> {
  chapterListPageUrl: string
}

export const collectNovelInfo = (): CollectDataReturn | null => {

  const meta = {} as CollectDataReturn;

  // Thumbnail
  const thumbnailHTML = document.querySelector('.books .book img');
  if (thumbnailHTML) {
    const imageUrl = thumbnailHTML.getAttribute('src');
    if (imageUrl) {
      meta.thumbnail = imageUrl
    }
  }

  // Chapter list page url
  const novelIdEl = document.querySelector('*[data-novel-id]');
  if (novelIdEl) {
    const chapterListPageId = novelIdEl?.getAttribute('data-novel-id')
    if (chapterListPageId) {
      const hostname = window.location.hostname;
      const urlParms = `/ajax/chapter-archive?novelId=${chapterListPageId}`
      meta.chapterListPageUrl = `https://${hostname}${urlParms}`
    }
  }

  // Title
  const titleHtml = document.querySelector('h3.title');
  if (titleHtml) {
    const title = titleHtml?.textContent?.trim();
    if (title) {
      meta.title = title
    }
  }

  // Description
  const descParagraphs = document.querySelectorAll('#tab-description .desc-text p');
  if (descParagraphs.length > 0) {
    const texts = Array.from(descParagraphs)
      .map(el => el?.textContent)
      .filter((text): text is string => typeof text === 'string' && text.length > 0);
    meta.description = texts;
  }


  // HTML list with genres, authors and status 
  const listMeta = document.querySelectorAll('ul.info-meta li');

  // Genres
  const genresItem = Array.from(listMeta).filter(el => el?.textContent?.includes('Genre:'))
  if (genresItem.length > 0) {
    const content = genresItem[0]?.textContent as string;
    const genres = content.split('Genre:')[1]?.trim();
    if (genres) {
      meta.genres = genres.includes(',') ? genres.split(',') : [genres]
    }
  }

  // Author
  const authorsItem = Array.from(listMeta).filter(el => el?.textContent?.includes('Author:'))
  if(authorsItem.length > 0){
    const content = authorsItem[0]?.textContent as string;
    const authors = content.split('Author:')[1]?.trim();
    if(authors){
      meta.author = authors.includes(',') ? authors.split(',') : [authors]
    }
  }

  // Status
  const statusItem = Array.from(listMeta).filter(el => el?.textContent?.includes('Status:'))
  if(statusItem.length > 0){
    const content = statusItem[0]?.textContent as string;
    const status = content.split('Status:')[1]?.trim();
    if(status){
      meta.status = status
    }
  }

  if(Object.values(meta).length === 0){
    return null
  }

  return meta
}