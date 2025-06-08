type ChapterListType = { title: string, url: string }[];

export const collectChapterList69shuba = () => {
  const list = [] as ChapterListType;

  const linksHTML = Array.from(document.querySelectorAll('#catalog ul li a'));
  for (const link of linksHTML) {
    const url = link.getAttribute('href');
    const title = link.getAttribute('title') || link.textContent?.trim();

    if (url && title) {
      list.push({
        url,
        title
      })
    }
  }

  return list;
}