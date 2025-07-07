import { EditorFormView } from "./FormView.js"
import { EditorReplacementService } from "./service.js";

export const ReplacementListEditor = (id, onBack) => {

  const service = EditorReplacementService()
  const list = Object.entries(service.getList(id) || {})

  const events = {
    onInput: () => view.enableButton(),
    onDelete: ({ currentTarget }) => {
      view.deleteItemInputs(currentTarget.parentNode)
      view.enableButton()
    }
  }

  const submitHandle = () => {
    try {
      const inputsValues = view.getInputValues()
      const result = service.updateReplacementList(id, inputsValues)
      if (result.error) {
        view.showInputError(result)
        return;
      }

      view.clearInvalid()
      view.flashSaveSuccess()
    } catch (error) {
      console.error(error)
    }
  }

  const itemsForElement = list.map((item) => ({
    text: item[0],
    replace: item[1],
    ...events
  }))

  const view = EditorFormView(itemsForElement, onBack, submitHandle, events);
  return view.editor;
}