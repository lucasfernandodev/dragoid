import { makeElement } from "../../../utils/make-element.js";
import { iconBack, iconDelete, iconPlus, iconSave } from "../../icons.js";
import { ReplacementStorage } from "../../../core/replacement/storage.js";

const addTerm = (original = '', replacement = '') => {
  const groupInput = makeElement('div', { class: 'group-input' })
  const originalInput = makeElement('input', { class: 'input-original', placeholder: 'Original term' });
  originalInput.value = original
  const replacementInput = makeElement('input', { class: 'input-replacement', placeholder: 'New term' });
  replacementInput.value = replacement
  const divider = makeElement('span', {}, '/');
  const buttonDelete = makeElement('button', { class: 'btn-delete' })
  buttonDelete.innerHTML = iconDelete

  buttonDelete.onclick = () => {
    groupInput.remove()
  }

  groupInput.append(originalInput, divider, replacementInput, buttonDelete);
  return groupInput;
}

const saveList = (id) => {
  const storage = new ReplacementStorage();
  const list = {};
  const listHTML = document.querySelector('.list-terms');
  const itens = listHTML.querySelectorAll('.group-input');
  for (const element of itens) {
    const original = element.querySelector('.input-original');
    const replacement = element.querySelector('.input-replacement')

    if (original && replacement) {
      if (original.value.length !== 0 && replacement.value.length !== 0) {
        list[original.value] = replacement.value
      }
    }
  }
  storage.update(id, list);
}

const generateReplacementItems = (id) => {
  const storage = new ReplacementStorage();
  const list = storage.get(id);
  if (!list) return [];
  const terms = Object.entries(list).map(row => {
    const [key, value] = row;
    const el = addTerm(key, value);
    return el;
  })
  return terms;
}



export const customReplacementOptions = (id) => {
  const section = makeElement('section', { class: 'section-replacement' })

  const replacementContainer = makeElement('div', { class: 'container-terms' });

  const addButton = makeElement('button', { class: 'btn-add-terms', 'aria-label': 'Add' });
  addButton.innerHTML = iconPlus;
  addButton.append(makeElement('span', {}, 'New replacement term'))

  addButton.onclick = () => {
    const item = makeElement('li')
    const term = addTerm();
    item.appendChild(term)
    replacementList.appendChild(term);
  }

  const replacementList = makeElement(
    'ul',
    { class: 'list-terms' },
    [...generateReplacementItems(id)]
  )

  replacementContainer.append(addButton, replacementList)


  const containerActions = makeElement('div', { class: 'container-actions' });
  const backButton = makeElement('button', { class: 'btn-back' });
  backButton.innerHTML = iconBack;
  backButton.appendChild(makeElement('span', {}, 'Back'))

  const saveButton = makeElement('button', { class: 'btn-save' });
  saveButton.innerHTML = iconSave
  saveButton.append(makeElement('span', {}, 'Save'))
  saveButton.onclick = () => {
    saveList(id);
    saveButton.innerHTML = ''
    saveButton.textContent = 'List Updated!'
  }

  containerActions.append(backButton, saveButton)

  section.append(replacementContainer, containerActions)
  return section
}