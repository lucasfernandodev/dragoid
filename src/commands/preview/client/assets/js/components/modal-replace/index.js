import { ui } from "../../utils/ui.js";
import { Modal } from "../modal/index.js";
import { Dashboard } from "./Dashboard/index.js";
import { ReplacementListEditor } from "./Editor/index.js";


export const ModalReplace = () => {
  const { div } = ui();
  const modalId = 'modal-replacement'
  const buttonTrigger = document.querySelector('.btn-open-replacement-modal')

  const modal = new Modal(
    {
      id: modalId,
      title: 'Substitution Lists',
      content: div('loading'),
      attr: {
        translate: 'no'
      }
    }
  )

  modal.attach(buttonTrigger)

  const showDashboard = () => {
    const DashboardView = Dashboard(showEditor)
    modal.setView('Substitution List', DashboardView)
  }

  const showEditor = (listId) => {
    const EditorView = ReplacementListEditor(listId, showDashboard)
    modal.setView(`Substituion Editor: ${listId}`, EditorView)
  }

  modal.onShow(() => {
    showDashboard()
  })
}