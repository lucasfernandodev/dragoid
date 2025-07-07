import { ui } from "../../../../utils/ui.js";
import { iconDelete, iconEdit, iconSave } from "../../../icons.js";

const ButtonSelect = (id, isActive = false, onSelect) => {
  const { input, label } = ui()

  const isChecked = isActive ? { checked: true } : {}

  return label(
    { class: ['button', 'button-select'], for: `list-${id}` },
    input({
      onClick: onSelect,
      type: 'radio',
      id: `list-${id}`,
      name: "list-item",
      ...isChecked
    })
  )
}

/**
 * Renders a list item representing a replacement list entry with configurable actions.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.id - Unique identifier and title for the list item.
 * @param {boolean} props.isActive - Indicates if this list item is currently selected/active.
 * @param {Object} [props.events] - Event handlers for item actions.
 * @param {Function} [props.events.onEdit] - Callback invoked when the Edit button is clicked.
 * @param {Function} [props.events.onDelete] - Callback invoked when the Delete button is clicked.
 * @param {Function} [props.events.onExport] - Callback invoked when the Export button is clicked.
 * @param {Function} [props.events.onSelect] - Callback invoked when the select radio button is toggled.
 * @returns {HTMLElement} The <li> element representing the list item.
 */
export const ListItem = (props) => {
  const { id, isActive, events } = props;
  const { onEdit, onDelete, onExport, onSelect } = events || {}

  const { li, h4, button, span, div } = ui()

  const containerHeading = div(
    { class: 'container-heading' },
    h4({ class: 'title' }, id) // id = title
  )

  // Actions
  const btnEdit = button(
    { class: 'button', onClick: onEdit },
    [iconEdit(), span('Edit')]
  )

  const btnDelete = button(
    { class: 'button', onClick: onDelete },
    [iconDelete(), span('Delete')]
  )

  const btnExport = button(
    { class: 'button', onClick: onExport },
    [iconSave(), span('Export')]
  )

  const containerActions = div(
    { class: 'container-actions' },
    [btnEdit, btnDelete, btnExport, ButtonSelect(id, isActive, onSelect)]
  )

  return li({ class: 'list-item' }, [containerHeading, containerActions])
}