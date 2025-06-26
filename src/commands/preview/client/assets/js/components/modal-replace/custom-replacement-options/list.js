import { htmlToElement } from "../../../utils/html-to-element.js";
import { makeElement } from "../../../utils/make-element.js";
import { iconDelete } from "../../icons.js";

export const createReplacementListItem = (term, replacement) => {
  const InputTerm = makeElement(
    'input',
    { value: term, class: 'input-original', placeholder: 'Original term' }
  )

  const InputReplacement = makeElement(
    'input',
    { value: replacement, class: 'input-replacement', placeholder: 'New term' }
  )

  const Divider = makeElement('span', {}, '/');

  const ButtonDelete = makeElement('button', { class: 'btn-delete' }, [htmlToElement(iconDelete)])

  const ErrorMessage = makeElement('p', { 'class': 'error-message' }, '')

  const Item = makeElement(
    'li',
    { class: 'group-input' },
    [InputTerm, Divider, InputReplacement, ButtonDelete, ErrorMessage]
  )

  const onBlur = (ev) => {
    const input = ev.originalTarget
    const value = input.value
    if (value === '') {
      input.classList.add('invalid');
      ErrorMessage.textContent = 'The term or replacement cannot be empty'
    } else {
      input.classList.remove('invalid')
      ErrorMessage.textContent = ''
    }
  }

  InputReplacement.onblur = onBlur;
  InputTerm.onblur = onBlur;

  ButtonDelete.onclick = () => {
    Item.remove()
  }

  return Item
}

export const TermsReplacementList = (list = []) => {
  const List = makeElement('ul', { class: 'list-terms' }, list.map(
    ([value, replacement]) => createReplacementListItem(value, replacement)
  ))
  return List
}
