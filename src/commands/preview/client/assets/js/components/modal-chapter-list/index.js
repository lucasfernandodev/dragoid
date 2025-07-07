
import { ui } from "../../utils/ui.js";
import { Modal } from "../modal/index.js";
import { chapterListView } from "./chapter-list-view.js";

export const modalChapterList = () => {
  const { span } = ui()
  const modalTitle = 'Chapters List'
  const buttonstoOpenModal = document.querySelectorAll('.toggle-dialog-chapter-list');
  const currentChapterId = Number.parseInt(window.location.search.replace("?id=", ""));

  const modal = new Modal(
    {
      id: 'modal-chapter-list',
      title: modalTitle,
      content: span({ class: 'loading' })
    }
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