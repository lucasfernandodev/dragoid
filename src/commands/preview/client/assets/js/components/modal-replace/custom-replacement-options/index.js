import { makeElement } from "../../../utils/make-element.js";
import { iconBack, iconPlus, iconSave } from "../../icons.js";
import { ReplacementStorage } from "../../../core/replacement/storage.js";
import { htmlToElement } from "../../../utils/html-to-element.js";
import { TermsReplacementList, createReplacementListItem } from "./list.js";




export const TermsListManagerView = (
  listId,
  onSaveSuccess = () => { }
) => {
  const storage = new ReplacementStorage();
  const list = Object.entries(storage.get(listId) || {});

  const ButtonAddTerm = makeElement(
    'button',
    { class: 'btn-add', 'aria-label': 'Add new term' },
    [htmlToElement(iconPlus), makeElement('span', {}, 'New replacement term')]
  );


  const List = TermsReplacementList(list);

  const ListWrapper = makeElement(
    'div',
    { class: 'container-terms' },
    [ButtonAddTerm, List]
  );

  const ButtonBack = makeElement(
    'button',
    { class: 'btn-back' },
    [htmlToElement(iconBack), makeElement('span', {}, 'Back')]
  )

  const ButtonSave = makeElement(
    'button',
    { class: 'btn-save' },
    [htmlToElement(iconSave), makeElement('span', {}, 'Save')]
  )

  const Footer = makeElement('div', { class: 'container-actions' }, [ButtonBack, ButtonSave])


  const createNewReplacementTerm = () => {
    const ReplacementTerm = createReplacementListItem("", "");
    List.appendChild(ReplacementTerm)
    List.querySelector('li:last-child input:first-of-type')?.focus()
  }

  const saveTermReplacementList = () => {
    const storage = new ReplacementStorage();
    const originalList = storage.get(listId) || {}
    const newList = {}

    const listEl = document.querySelector(`.${List.className}`);
    const fields = Array.from(listEl.querySelectorAll('li'));

    for (const field of fields) {
      const term = field.querySelector('input:first-of-type')
      const replacement = field.querySelector('input:last-of-type')
      const errorElement = field.querySelector('p');

      // Reset errors
      replacement.classList.remove('invalid')
      term.classList.remove('invalid')
      errorElement.textContent = ''

      // Start validation
      if (term.value.trim() === "" || replacement.value.trim() === '') {
        replacement.classList.add('invalid')
        term.classList.add('invalid')
        errorElement.textContent = 'The term or replacement cannot be empty'
        break;
      }

      if (term.value.trim() === replacement.value.trim()) {
        replacement.classList.add('invalid')
        term.classList.add('invalid')
        errorElement.textContent = 'Invalid values. Identical terms are not allowed'
        break;
      }

      newList[term.value.trim()] = replacement.value.trim()
    }

    if (fields.length === Object.entries(newList).length) {
      // Check if list modified 
      if (JSON.stringify(originalList) !== JSON.stringify(newList)) {
        storage.update(listId, newList);
        ButtonSave.textContent = 'List Updated!'
        setTimeout(onSaveSuccess, 250)
      }
    }
  }


  // Register functions
  ButtonAddTerm.onclick = createNewReplacementTerm;
  ButtonSave.onclick = saveTermReplacementList;

  const View = makeElement(
    'section',
    { class: 'section-replacement' },
    [ListWrapper, Footer]
  );
  return View;
}