import { modalChapterList } from "../components/modal-chapter-list/index.js";
import { modalChapterStyle } from "../components/modal-chapter-style/index.js";
import { modalReplacement } from "../components/modal-replace/index.js";
import { appyChapterStyle } from "../core/chapter-style-setting/appy-chapter-style.js";
import { applyReplacementListToChapter } from "../core/replacement/apply-replacement-list-to-chapter.js";
import { isMobile, onGesture } from "../utils.js";



const main = async () => {
  const isMobilewView = isMobile();

  if (isMobilewView) {
    const navigationMenu = document.querySelector(".floating-navigation");
    // Start gesture 
    onGesture(() => {
      navigationMenu.style.display = 'flex'
      setTimeout(() => {
        navigationMenu.style.display = "none";
      }, 1500)
    })
  } 

  // Modais
  await modalChapterList() 
  modalChapterStyle() 
  modalReplacement()



  // Extra functions
  applyReplacementListToChapter()
  appyChapterStyle()
}

await main()
