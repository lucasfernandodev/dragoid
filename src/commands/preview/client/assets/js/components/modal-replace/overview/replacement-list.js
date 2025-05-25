import { makeElement } from "../../../utils/make-element.js"
import { iconDelete, iconEdit } from "../../icons.js";
import { ReplacementStorage } from "../../../core/replacement/storage.js"

export const replacementList = () => {
  const list = makeElement('ul', { class: 'overview-list' });

  const generateList = () => {
    const storage = new ReplacementStorage();
    const isCurrectListActive = window.localStorage.getItem('replacement-list-active');
    const item = (id) => {
      const container = makeElement('li', { 'data-id': id })
      const label = makeElement('p', { class: 'label' }, id)
      const containerButtons = makeElement('div', { class: 'group-buttons' })
      const btnEdit = makeElement('button', {
        class: 'btn-edit',
        'data-id': id
      })

      btnEdit.innerHTML = iconEdit;
      btnEdit.appendChild(makeElement('span', {}, 'Edit'))

      const btnDelete = makeElement('button', { class: 'btn-delete' })
      btnDelete.innerHTML = iconDelete

      btnDelete.onclick = () => {
        storage.delete(id);
        if (isCurrectListActive === id) {
          window.localStorage.removeItem('replacement-list-active')
        }
      }


      const btnSelect = makeElement('button', { class: `btn-select ${isCurrectListActive === id ? 'active' : ''}` }, makeElement('span', {}));
      btnSelect.onclick = () => {
        const buttons = document.querySelectorAll('.overview-list .group-buttons .btn-select');
        buttons.forEach(btn => btn.classList.remove('active'))
        btnSelect.classList.add('active')
        window.localStorage.setItem('replacement-list-active', id)
      }


      containerButtons.append(btnEdit, btnDelete, btnSelect)
      container.append(label, containerButtons)
      return container;
    }

    const emptyItem = makeElement('li', { class: 'empty-message' },
      'No substitution lists created yet. Start by adding your first one!'
    )

    if (storage.size() === 0) {
      return [emptyItem];
    }

    const ids = storage.getAllIds()

    return ids.map(id => item(id));
  }

  list.append(...generateList());

  window.addEventListener('storage-replacement', () => {
    list.innerHTML = '';
    list.append(...generateList());
  })

  return list;
}