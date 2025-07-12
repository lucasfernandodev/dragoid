import { modalChapterStyle } from "../components/modal-chapter-style/index.js";
import { ModalReplace } from "../components/modal-replace/index.js";
import { applyUserStyles } from "../core/chapter-style-setting/apply-user-style.js";
import { applyUserReplacements } from "../core/replacement/apply-user-replacements.js";
import { showFlotMenuShortcut } from "../core/shortcuts/keyboard/show-float-menu.js";
import { ShortcutTouchShowFloatingNavigation } from "../core/shortcuts/touch/show-floating-navigation.js";


const initSingleChapterPage = async () => {
  // === Attach modais ===
  modalChapterStyle()
  ModalReplace()

  // === User Tools ===
  applyUserReplacements()
  applyUserStyles()
  new ShortcutTouchShowFloatingNavigation()
  showFlotMenuShortcut()
}

window.onload = async () => {
  await initSingleChapterPage()
}