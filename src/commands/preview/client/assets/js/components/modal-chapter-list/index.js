import { Modal } from "../modal/index.js";
import { chapterListView } from "./chapter-list-view.js";

export const modalChapterList = async () => {

  const buttonstoOpenModal = document.querySelectorAll('.toggle-dialog-chapter-list');

  const currentChapterId = Number.parseInt(window.location.search.replace("?id=", ""));
  const view = await chapterListView(currentChapterId)

  const modal = new Modal('modal-chapter-list', 'Chapters List', view)

  modal.onShow(() => {
    const activeItem = document.querySelector('a[data-active="true"]')
    if (activeItem) {
      activeItem.scrollIntoView()
    }
  })

  buttonstoOpenModal.forEach(
    el => modal.attach(el)
  )
}