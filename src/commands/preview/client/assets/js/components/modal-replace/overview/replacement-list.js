import { makeElement } from "../../../utils/make-element.js"
import { iconDelete, iconEdit } from "../../icons.js";
import { ReplacementStorage } from "../../../core/replacement/storage.js"
import { htmlToElement } from "../../../utils/html-to-element.js";

const setReplacementListActive = (id) => {
  if (id) {
    window.localStorage.setItem('replacement-list-active', id)
    window.location.reload()
  }
}

const getReplacementListActive = () => {
  return window.localStorage.getItem('replacement-list-active')
}

const removeReplacementListActive = () => {
  window.localStorage.removeItem('replacement-list-active');
  window.location.reload()
}


const ButtonEdit = (id) => {
  return makeElement(
    'button',
    { class: 'btn-edit', 'data-id': id },
    [htmlToElement(iconEdit), makeElement('span', {}, 'Edit')]
  )
}

const ButtonDelete = (onDelete = () => { }) => {
  const btnDelete = makeElement(
    'button',
    { class: 'btn-delete', 'aria-label': 'Delete' },
    [htmlToElement(iconDelete)]
  )

  btnDelete.onclick = onDelete;

  return btnDelete
}

const ButtonSelect = (isActive = false, onClick = () => { }) => {
  const btnSelect = makeElement(
    'button',
    {
      class: `btn-select ${isActive ? 'active' : ''}`,
      'aria-label': 'Select'
    },
    makeElement('span', { 'aria-hidden': true })
  );

  btnSelect.onclick = (ev) => onClick(ev, btnSelect);
  return btnSelect
}




export const replacementList = () => {
  const List = makeElement('ul', { class: 'overview-list' });

  const generateList = () => {
    const storage = new ReplacementStorage();
    const isCurrectListActive = getReplacementListActive();

    const item = (id) => {
      const Container = makeElement('li', { 'data-id': id, class: 'item' })
      const Label = makeElement('p', { class: 'label' }, id)

      function onDeleteHandle() {
        storage.delete(id);
        if (isCurrectListActive === id) {
          removeReplacementListActive()
        }
      }

      function onSelectHandle(_, Button) {
        document.querySelectorAll(
          '.overview-list .group-buttons .btn-select'
        ).forEach(btn => btn.classList.remove('active'));

        const isActive = getReplacementListActive();

        if (isActive) {
          removeReplacementListActive();
          return;
        }

        Button.classList.add('active')
        setReplacementListActive(id)
      }

      const ContainerButtons = makeElement(
        'div',
        { class: 'group-buttons' },
        [
          ButtonEdit(id),
          ButtonDelete(onDeleteHandle),
          ButtonSelect(isCurrectListActive === id, onSelectHandle)
        ]
      )

      Container.append(Label, ContainerButtons)
      return Container;
    }


    const EmptyItem = makeElement('li', { class: 'empty-message' },
      'No substitution lists created yet. Start by adding your first one!'
    )

    if (storage.size() === 0) {
      return [EmptyItem];
    }

    const ids = storage.getAllIds()

    return ids.map(id => item(id));
  }

  List.append(...generateList());

  window.addEventListener('storage-replacement', () => {
    List.innerHTML = '';
    List.append(...generateList());
  })

  return List;
}