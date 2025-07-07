import { ui } from "../../../../utils/ui.js";
import { iconClose, iconPlus, iconUpload } from "../../../icons.js";


const ButtonUpload = (onUpload) => {
  const { label, input, span } = ui();

  return label({ class: ['button', 'button-upload'], for: 'upload-list' }, [
    iconUpload(), span('Load') , input({
      id: 'upload-list',
      type: "file",
      accept: '.json',
      onchange: onUpload
    })
  ])
}


const ContainerForm = (onSave, onCancel) => {
  const { form, input, button, p, div } = ui()

  return form({ class: 'container-form' }, [
    input({ class: 'input', placeholder: "Enter list name" }),
    p({ class: 'error-message' }),
    div({ class: 'group-actions' }, [
      button(
        {
          onClick: onSave,
          type: 'submit',
          class: ['button', 'button-save']
        },
        'Save'
      ),
      button(
        {
          onClick: onCancel,
          type: 'button',
          class: ['button', 'button-cancel']
        },
        'Cancel'
      )
    ])
  ])
}



export const FormCreateReplacementList = () => {

  const { div, button, p, span } = ui()

  const form = div({ class: 'container-create-list' });


  const render = (props = {}) => {

    const {
      isCreating,
      onSave,
      onCancel,
      onUpload,
      onCreate
    } = props

    // Clear childrens
    form.replaceChildren()

    const containerTrigger = div({ class: 'container-trigger' }, [
      button({ class: ['button', 'button-add'], onClick: onCreate }, [
        iconPlus(), span('Add')
      ]),
      ButtonUpload(onUpload)
    ])


    form.append(
      isCreating ? ContainerForm(onSave, onCancel) : containerTrigger
    )
  }

  const getInputValue = () => {
    const input = form.querySelector('input')
    return input?.value
  }


  const showError = (message) => {
    const input = form.querySelector('input');
    const errorMessageElement = form.querySelector('p');
    errorMessageElement.textContent = message
    input.classList.add('invalid')
  }

  const clearError = () => {
    const input = form.querySelector('input');
    const errorMessageElement = form.querySelector('p');
    errorMessageElement.textContent = ''
    input.classList.remove('invalid')
  }

  const showUploadError = (message) => {
    /**
     * Callback to remove the error banner when close button is clicked.
     * @param {MouseEvent} event
     */
    function closeMessageError({ currentTarget }) {
      currentTarget.parentNode.remove()
    }

    form.append(
      div({ class: 'upload-error-message' }, [
        p(`File upload failed. Invalid file! ${message ? message : ''}`),
        button({ onclick: closeMessageError, type: 'button' }, [iconClose()])
      ])
    )
  }


  return { render, form, getInputValue, showError, clearError, showUploadError }
}