import { makeElement } from "../../utils/make-element.js";
import { Modal } from "../modal/index.js";
import { chapterListView } from "./chapter-list-view.js";

export const modalChapterList = () => {
  const modalTitle = 'Chapters List'
  const buttonstoOpenModal = document.querySelectorAll('.toggle-dialog-chapter-list');
  const currentChapterId = Number.parseInt(window.location.search.replace("?id=", ""));

  const modal = new Modal(
    'modal-chapter-list',
    modalTitle,
    makeElement('span', { class: 'loading' }, '') // loading
  )

  modal.onShow(async () => {
    const view = await chapterListView(currentChapterId)
    modal.setView(modalTitle, view)

    const activeItem = document.querySelector('a[data-active="true"]')
    if (activeItem) {
      activeItem.scrollIntoView()
    }
  })

  buttonstoOpenModal.forEach(
    el => modal.attach(el)
  )
}