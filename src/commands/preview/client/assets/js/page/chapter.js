import { modalChapterList } from "../components/modal-chapter-list/index.js";
import { modalChapterStyle } from "../components/modal-chapter-style/index.js";
import { modalReplacement } from "../components/modal-replace/index.js";
import { applyUserStyles } from "../core/chapter-style-setting/apply-user-style.js";
import { applyUserReplacements } from "../core/replacement/apply-user-replacements.js";
import { onTouchGesture } from "../core/shortcuts/on-touch-gesture.js";
import { isMobile } from "../utils/is-Mobile.js";


const initChapterPage = async () => {
  const isMobileView = isMobile();

  // === Inicializa modais ===
  modalChapterStyle() 
  modalReplacement()
  await modalChapterList() 



  // === Aplica customizações do usuário no capítulo ===
  applyUserReplacements()
  applyUserStyles()


  // Handle with show/hidden floating navigation in mobile devices
  if (isMobileView) {
    const navigationMenu = document.querySelector(".floating-navigation");
    onTouchGesture(() => {
      navigationMenu.style.display = 'flex'
      setTimeout(() => {
        navigationMenu.style.display = "none";
      }, 1500)
    })
  } 
}

await initChapterPage()
