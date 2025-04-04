import { getChapterlist } from "../api.js";

export const dialogListChapter = async () => {
  const buttonsOpenDialog = document.querySelectorAll('.toggle-dialog-chapter-list');
  const dialog = document.querySelector('.dialog-chapter-list');
  const buttonCloseDialog = document.querySelector('.btn-close-dialog-chapter-list');
  const chapterList = document.querySelector("#chapte_list");
  const displayChapterQTD = document.querySelector(".chapter_qtd");



  const chapters = await getChapterlist();

  buttonsOpenDialog.forEach(buttonOpenDialog => {
    buttonOpenDialog.addEventListener('click', () => {
      const isHidden = dialog.getAttribute('data-hidden');
      if (isHidden === 'true') {
        document.body.style.overflow = 'hidden';
        dialog.setAttribute('data-hidden', 'false')
  
        const activeItem = document.querySelector('a[data-active="true"]')
        if (chapters.length > 0) {
          activeItem.scrollIntoView()
        }
      } else {
        document.body.style.overflow = 'unset';
        dialog.setAttribute('data-hidden', 'true')
      }
    })
  });

  buttonCloseDialog.addEventListener('click', () => {
    dialog.setAttribute('data-hidden', 'true')
    document.body.style.overflow = 'unset';
  })



  const createListItem = (title, chapterId, isActive = false) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.setAttribute('href', `/chapter/?id=${chapterId}`);
    a.setAttribute('data-active', isActive)
    a.textContent = title;
    li.appendChild(a)
    return li;
  }

  chapters.forEach((chapter, index) => {
    const id = Number.parseInt(window.location.search.replace("?id=", ""));
    const item = createListItem(chapter.title, index, index === id);
    chapterList.appendChild(item)
  })

  displayChapterQTD.textContent = chapters.length;
  displayChapterQTD.setAttribute('title', `Number of available chapters: ${chapters.length}`)
}