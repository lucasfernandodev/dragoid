import { modalChapterStyle } from "../components/modal-chapter-style/index.js";
import { modalReplacement } from "../components/modal-replace/index.js";
import { applyUserStyles } from "../core/chapter-style-setting/apply-user-style.js";
import { applyUserReplacements } from "../core/replacement/apply-user-replacements.js";


const initSingleChapterPage = async () => {

  // === Attach modais ===
  modalChapterStyle()
  modalReplacement()

  // === User Tools ===
  applyUserReplacements()
  applyUserStyles()
}

await initSingleChapterPage()
