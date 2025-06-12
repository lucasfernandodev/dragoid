export const collectChapter = () => {
  window.localStorage.clear();
  
  const titleHTML = document.querySelector('#chapter h2 a.chr-title span');
  const paragraphsHTML = document.querySelectorAll('#chr-content p');
  
  const chapterTitle = titleHTML?.textContent;
  const chapterContent = Array.from(paragraphsHTML).map(ph => {
    return ph?.textContent?.trim();
  }).filter((ph): ph is string => typeof ph === 'string' && ph.length > 0)

  if(chapterTitle && chapterContent.length > 0) {
    return {
      title: chapterTitle,
      content: chapterContent
    }
  }

  return null;
}