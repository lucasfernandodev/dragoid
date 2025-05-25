import { Modal } from "../modal/index.js";
import { customReplacementOptions } from "./custom-replacement-options/index.js";
import { replacementOverview } from "./overview/index.js";


export const modalReplacement = () => {
  const modal = new Modal(
    'modal-replacement',
    'Substitution Lists Overview',
    replacementOverview()
  )

  modal.attach(document.querySelector('.btn-open-replacement-modal'))

  const modalHtml = modal.getModal();
  modalHtml.setAttribute('translate', 'no')

  const swapViewToCustomReplacementOptionsView = (ev) => {
    const isCorrectTarget = ev.target.closest('.btn-edit');
    if (!isCorrectTarget) {
      return; // clique fora de um item “.item”
    }

    const listId = isCorrectTarget.getAttribute('data-id');
    const customReplacementOptionsView = customReplacementOptions(listId)
    modal.setView(
      'Edit Substitution List',
      customReplacementOptionsView
    )

    const backButton = customReplacementOptionsView.querySelector('.btn-back')
    backButton.addEventListener('click', () => {
      modal.setView('Substitution Lists Overview', replacementOverview())
      const overviewList = modalHtml.querySelector('.overview-list');
      overviewList.addEventListener('click', swapViewToCustomReplacementOptionsView)
    })
  }


  const overviewList = modalHtml.querySelector('.overview-list');
  overviewList.addEventListener('click', swapViewToCustomReplacementOptionsView)
}