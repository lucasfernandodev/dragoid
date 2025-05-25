import { Modal } from "../modal/index.js"
import { chapterStyleSetting } from "./chapter-style-setting.js" 

export const modalChapterStyle = () => {
  const modal = new Modal(
    'modal-chapter-style',
    'Chapter Style',
    chapterStyleSetting()
  )

  const htmlModal = modal.getModal()
  htmlModal.setAttribute('translate', 'no')

  const btnOpenModal = document.querySelector('.button-mcc')

  modal.attach(btnOpenModal);

}