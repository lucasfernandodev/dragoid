import { ui } from "../../../utils/ui.js"
import { iconBack, iconCheck, iconDelete, iconPlus, iconSave } from "../../icons.js"

const ReplacementFormInput = ({
  text,
  replace,
  onDelete,
  onInput
}) => {
  const { input, div, button, p } = ui()

  const inputText = input({
    onInput: onInput, class: 'input', value: text, 'data-type': 'text', placeholder: 'text'
  })

  const inputReplace = input({
    onInput: onInput, class: 'input', value: replace, 'data-type': 'replace', placeholder: 'replace'
  })

  const divider = div({ class: 'divider' }, "/");

  const btnDelete = button(
    { class: 'btn-delete', onClick: onDelete, type: 'button' },
    iconDelete()
  )

  const errorMessage = p({ class: 'input-error-message' })

  return div(
    { class: 'group-input' },
    [inputText, divider, inputReplace, btnDelete, errorMessage]
  )
}

const AddReplacementFormInput = (onClick) => {
  const { button, span } = ui();

  return button(
    { class: 'btn-add', onClick: onClick, type: 'button' },
    [iconPlus(), span('New replacement')]
  )
}

const ReplacementFormActions = (onBack, onSave) => {
  const { div, span, button } = ui();

  return div({ class: 'editor-actions' }, [
    button(
      { onClick: onBack, class: ['button', 'button-back'] },
      [iconBack(), span('Back')]),
    button(
      { onClick: onSave, disabled: true, class: ['button', 'button-save'] },
      [iconSave(), span('Save')])
  ])
}


export const EditorFormView = (
  items = [],
  onBack,
  onSave,
  { onInput, onDelete }
) => {
  const { div, p, form } = ui()
  const editor = div({ class: 'editor' })
  const wrapper = div({ class: 'wrapper' })
  const emptyMessage = p({ class: 'empty' }, 'Your replacement list is empty')

  if (items.length === 0) {
    wrapper.appendChild(emptyMessage)
  }

  const itemsForView = items.map(item => ReplacementFormInput({
    text: item.text,
    replace: item.replace,
    onInput: item.onInput,
    onDelete: item.onDelete
  }))

  if (itemsForView.length > 0) {
    wrapper.replaceChildren()
    wrapper.append(...itemsForView)
  }

  const addNewReplaceInput = ({ text, replace, onDelete, onInput }) => {
    if (wrapper.firstChild === emptyMessage) {
      wrapper.firstChild.remove()
    }

    const item = ReplacementFormInput({
      text, replace, onDelete, onInput
    })

    wrapper.appendChild(item)
  }

  const editorContainer = form({ class: 'editor-form' }, [
    AddReplacementFormInput(
      () => addNewReplaceInput({ text: '', replace: '', onDelete, onInput })
    ),
    wrapper
  ])


  editor.append(
    editorContainer,
    ReplacementFormActions(onBack, onSave)
  )

  return {
    editor: editor,
    enableButton: () => {
      editor.querySelector('.button-save')?.removeAttribute('disabled')
    },
    flashSaveSuccess: () => {
      const btnSave = editor.querySelector('.button-save');
      if (btnSave) {
        btnSave.replaceChildren();
        btnSave.append(iconCheck(), 'List Updated');

        setTimeout(() => {
          btnSave.replaceChildren();
          btnSave.append(iconSave(), 'Save')
        }, 1000);
      }
    },
    getInputValues: () => {
      const allGroupInputs = wrapper.querySelectorAll('.group-input');
      const collectedData = Array.from(allGroupInputs).map(el => {
        const inputText = el.querySelector('input[data-type="text"');
        const InputReplacement = el.querySelector('input[data-type="replace"')
        return [inputText?.value, InputReplacement?.value]
      })
      return collectedData;
    },
    deleteItemInputs: (item) => {
      if (!item) return;

      item.remove()
      // Check if empty list
      const allGroupInputs = wrapper.querySelectorAll('.group-input')
      if (allGroupInputs.length === 0) {
        wrapper.appendChild(emptyMessage)
      }
    },
    showInputError: ({ message, index, key }) => {
      const allGroupInputs = wrapper.querySelectorAll('.group-input');
      const elErrorMessage = allGroupInputs[index].querySelector('.input-error-message');
      const input = allGroupInputs[index].querySelector(`input[data-type="${key}"`);
      if (input) {
        elErrorMessage.textContent = message;
        input.classList.add('invalid')
        input.focus()
      }
    },
    clearInvalid: () => {
      const allInputs = wrapper.querySelectorAll('input.invalid');
      const allMessageErrors = wrapper.querySelectorAll('.input-error-message');

      allInputs.forEach(input => input.classList.remove('invalid'));
      allMessageErrors.forEach(el => { el.textContent = '' })
    }
  }
}

