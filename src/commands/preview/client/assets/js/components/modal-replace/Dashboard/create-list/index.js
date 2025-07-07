
import { FormCreateReplacementList } from "./FormView.js"
import { CreateReplacementListService } from "./service.js"

export const CreateReplacementList = () => {
  const view = FormCreateReplacementList()
  const service = CreateReplacementListService()

  const updateView = (isCreating = false) => {
    view.render({
      isCreating: isCreating,
      onCreate: () => updateView(true),
      onCancel: () => updateView(false),
      onSave: (ev) => {
        ev.preventDefault()
        const value = view.getInputValue()
        const result = service.add(value);
        if (result.error === true) {
          result.message && view.showError(result.message)
          return;
        }

        updateView(false)
      },
      onUpload: async (ev) => {
        const file = ev.target.files.item(0);
        const result = await service.upload(file);
        if (result.error) {
          result.message && view.showUploadError(result.message)
        }
      }
    })
  }


  updateView()
  return view.form;
}