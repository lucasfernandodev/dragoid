import { ListView } from "./ListView.js"
import { OverviewReplacementServices } from "./service.js"

export const OverviewReplacementList = (openEditor) => {
  const view = ListView()

  const updateView = () => {
    const service = OverviewReplacementServices()
    const listIds = service.getAllIds();
    const currentActiveList = service.getActiveListId();

    const itemsForView = listIds.map(id => ({
      id: id,
      isActive: currentActiveList === id,
      onEdit: () => openEditor(id),
      onDelete: () => service.deleteList(id),
      onExport: () => service.exportList(id),
      onSelect: (ev) => {
        if (ev.currentTarget?.checked && currentActiveList === id) {
          service.removeActiveListId(id)
          window.location.reload()
        }

        if (ev.currentTarget?.checked && currentActiveList !== id) {
          service.setActiveListId(id)
          window.location.reload()
        }
      }
    }))

    view.render(itemsForView)
  }

  window.addEventListener('storage-replacement', updateView);
  updateView()

  return view.list;
}