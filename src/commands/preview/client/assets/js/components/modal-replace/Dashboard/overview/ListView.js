import { ui } from "../../../../utils/ui.js"
import { ListItem } from "./ListItem.js"

export const ListView = () => {
  const { ul, p } = ui()
  const list = ul({ class: 'container-list' })
  const emptyMessage = p(
    { class: 'empty-message' },
    "You haven't created a substitution list yet. Use this feature to easily fix incorrect words or translations."
  )

  const render = (items) => {
    list.innerHTML = ''
    const itemElements = items.map(item => ListItem({
      id: item.id,
      isActive: item.isActive,
      events: {
        onEdit: item.onEdit,
        onDelete: item.onDelete,
        onExport: item.onExport,
        onSelect: item.onSelect
      }
    }))
    if (itemElements.length > 0) {
      list.contains(emptyMessage) && emptyMessage.remove()
      list.append(...itemElements)
    } else {
      list.append(emptyMessage)
    }
  }

  return {
    list,
    render
  }
} 