import { Modal } from "../modal/index.js"
import { chapterStyleSetting } from "./chapter-style-setting.js"

export const modalChapterStyle = () => {
  const modal = new Modal(
    {
      id: 'modal-chapter-style',
      title: 'Chapter Style',
      content: chapterStyleSetting(),
      attr: {
        translate: 'no'
      }
    }
  )

  const btnOpenModal = document.querySelector('.button-mcc')

  modal.attach(btnOpenModal);
}