import type { INovelMeta } from "../../../../types/bot.ts";

interface INovel69shuba extends Omit<INovelMeta, 'language'>{
  chapterListPageUrl: string;
}

export const collectNovelInfo69shuba = () => {
  const getParagraphsContent = (paragraphs: NodeListOf<Element>) => {
    const resultData: string[] = [];
  
    const parseParagraph = (paragraph: Element) => {
      let currentTextRow = '';
      const childrens = paragraph.childNodes as NodeListOf<Element>;
  
      childrens.forEach((node) => {
        const isBrTag = node.nodeType === Node.ELEMENT_NODE && node?.tagName === 'BR';
  
        // Break row
        if (isBrTag) {
          const currentTextRowParsed = currentTextRow.trim();
          currentTextRowParsed && resultData.push(currentTextRowParsed);
          currentTextRow = '';
        } else {
          currentTextRow += node.textContent
        }
      })
  
      const currentTextRowParsed = currentTextRow.trim();
      currentTextRowParsed && resultData.push(currentTextRowParsed)
    }
  
    paragraphs.forEach(parseParagraph)
    return resultData;
  }

  const data = {} as INovel69shuba;

  const titleHtml = document.querySelector(".booknav2 h1 a");
  const authorHtml = document.querySelectorAll(".booknav2 p a");
  const descHtml = document.querySelectorAll(".mybox .navtxt p");
  const genresHtml = document.querySelectorAll(".booknav2 p");
  const statusHTML = document.querySelectorAll(".booknav2 p")
  const thumbnailHtml = document.querySelector(".bookimg2 img");
  const chapterListLinkHTML = document.querySelectorAll(".addbtn .btn");

  if (titleHtml?.textContent) {
    data.title = titleHtml.textContent
  }

  if (authorHtml.length > 0 && authorHtml[0]?.textContent) {
    const isMultiAuthor = authorHtml[0].textContent.includes(",");
    if(isMultiAuthor){
      data.author = authorHtml[0].textContent.split(",");
    }else{
      data.author = [authorHtml[0].textContent]
    } 
  }

  if (descHtml.length > 0) {
    const desc = getParagraphsContent(descHtml);
    if(desc.length > 0){
      data.description = desc;
    }
  }

  if (genresHtml.length > 0) {
    const genresArray = Array.from(genresHtml).map(el => {
      const text = el?.textContent || '';
      if (text.includes('分类：')) {
        const genres = text.split('分类：')[1].trim();
        return genres.includes(',') ? genres.split(",") : [genres];;
      }
    });
    if(genresArray.length > 0){
      data.genres = genresArray.flat().filter(content => content !== undefined) as string[];
    }
  }

  if(statusHTML.length > 0){
    const statusEl = Array.from(statusHTML).filter(el => el?.textContent?.includes('|'));
    if(statusEl.length > 0){
      const elText = statusEl[0]?.textContent || ''
      const status = elText.split("|")[1].trim()
      if(status.length > 0){
        data.status = status;
      }
    } 
  }

  if (thumbnailHtml) {
    const url = thumbnailHtml.getAttribute('src');
    if(url){
      data.thumbnail = url
    }
  }

  if (chapterListLinkHTML.length > 0) {
    const link = chapterListLinkHTML[0];
    const chapterListPageUrl = link.getAttribute('href');
    if (chapterListPageUrl) {
      data.chapterListPageUrl = chapterListPageUrl;
    }
  }


  if(Object.values(data).length === 0){
    return null
  }

  return data
}

