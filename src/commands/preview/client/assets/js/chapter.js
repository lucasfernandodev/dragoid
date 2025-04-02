import { CustomChapter } from "./custom_chapter.js";
import { isMobile, onGesture } from "./utils.js";

const handleDialogChapterList = async () => {
  const buttonOpenDialog = document.querySelector('.toggle-dialog-chapter-list');
  const dialog = document.querySelector('.dialog-chapter-list');
  const buttonCloseDialog = document.querySelector('.btn-close-dialog-chapter-list');
  const chapterList = document.querySelector("#chapte_list");
  const displayChapterQTD = document.querySelector(".chapter_qtd");


  buttonOpenDialog.addEventListener('click', () => {
    const isHidden = dialog.getAttribute('data-hidden');
    if (isHidden === 'true') {
      document.body.style.overflow = 'hidden';
      dialog.setAttribute('data-hidden', 'false')
    } else {
      document.body.style.overflow = 'unset';
      dialog.setAttribute('data-hidden', 'true')
    }
  });

  buttonCloseDialog.addEventListener('click', () => {
    dialog.setAttribute('data-hidden', 'true')
    document.body.style.overflow = 'unset';
  })

  const getChapterlist = async () => {
    const response = await fetch("/api/chapters");
    const data = await response.json();
    return data?.chapters || [];
  }

  const chapters = await getChapterlist();

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
    const id = Number.parseInt(window.location.search.replace("?id=",""));
    const item = createListItem(chapter.title, index, index === id);
    chapterList.appendChild(item)
  })

  displayChapterQTD.textContent = chapters.length;
  displayChapterQTD.setAttribute('title', `Number of available chapters: ${chapters.length}`)
}

const main = () => {
  const isMobilewView = isMobile();
  if (!isMobilewView) return;

  const navigationMenu = document.querySelector(".navigation-chapters");

  onGesture(() => {
    navigationMenu.style.display = 'flex'
    setTimeout(() => {
      navigationMenu.style.display = "none";
    }, 1500)
  })
}

main()
new CustomChapter()
handleDialogChapterList()