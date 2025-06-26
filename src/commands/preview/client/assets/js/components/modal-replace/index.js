import { Modal } from "../modal/index.js";
import { TermsListManagerView } from "./custom-replacement-options/index.js";
import { replacementOverview } from "./overview/index.js";


export const modalReplacement = () => {
  const modalId = 'modal-replacement'
  const buttonTrigger = document.querySelector('.btn-open-replacement-modal')

  const modal = new Modal(modalId, 'Substitution Lists Overview', replacementOverview())
  modal.attach(buttonTrigger)

  const modalHTML = modal.getModal()

  modalHTML.setAttribute('translate', 'no')


  // Toggle for next view
  const showListManagerView = (listId) => {
    // Creating view with callback to return on success
    const termsListManagerView = TermsListManagerView(listId, () => {
      modal.setView('Substitution Lists Overview', replacementOverview())
    })

    // Add event to back view on click
    termsListManagerView.querySelector('.btn-back').addEventListener('click', () => {
      modal.setView('Substitution Lists Overview', replacementOverview())
    })

    // set new view
    modal.setView('Edit Substitution List', termsListManagerView)
  }


  // if click to edit loading next view
  modalHTML.addEventListener('click', ev => {
    const btn = ev.target.closest('.btn-edit');
    if (!btn) return;

    const listId = btn.getAttribute('data-id');
    showListManagerView(listId)
  })
}