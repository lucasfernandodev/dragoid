type List = {
  title: string;
  url: string;
}[]

export const collectChapterList = () => {
  const list = [] as List
  const allLinks = document.querySelectorAll('.list-chapter li a');
  Array.from(allLinks).map(link => {
    const title = link.getAttribute('title')?.trim();
    const url = link.getAttribute('href')?.trim()
    if (title && url) {
      list.push({
        title,
        url
      })
    }
  })
  return list
}