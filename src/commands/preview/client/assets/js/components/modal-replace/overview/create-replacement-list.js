import { makeElement } from "../../../utils/make-element.js"
import { ReplacementStorage } from "../../../core/replacement/storage.js"


export const createReplacementList = () => {
  const container = makeElement('div', {
    class: 'create-list-container',
    'data-active': false
  })

  // Form for creating new List
  const form = makeElement('form', { class: 'form-new-list' })
  const input = makeElement('input', { placeholder: 'New list name' })
  const btnSave = makeElement('button', { 'class': 'btn-save' }, 'Add')
  const btnCancel = makeElement('button', { class: 'btn-cancel' }, 'Cancel')

  btnSave.onclick = (ev) => {
    ev.preventDefault()
    const lists = new ReplacementStorage();

    try {
      input.classList.remove('invalid')
      lists.create(input.value)
    } catch (error) {
      input.classList.add('invalid')
      return
    }

    container.classList.toggle('expand')
    input.value = ''
  }

  btnCancel.onclick = (ev) => {
    ev.preventDefault();
    container.classList.toggle('expand')
    input.value = ''
    input.classList.remove('invalid')
  }

  form.append(input, btnSave, btnCancel)


  // Trigger for show form
  const buttonTrigger = makeElement('button', {
    class: 'btn btn-trigger btn-create-new-list'
  }, 'New Substitution List')

  buttonTrigger.onclick = () => {
    container.classList.toggle('expand')
  }

  container.append(buttonTrigger, form)

  return container;
}