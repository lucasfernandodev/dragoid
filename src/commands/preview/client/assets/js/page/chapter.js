import { modalReplacement } from "../components/modal-replace/index.js";
import { observerDomChanges } from "../core/observer-dom-changes.js";
import { applyReplacementListToChapter } from "../core/replacement/apply-replacement-list-to-chapter.js";
import { CustomChapter } from "../handle/custom_chapter.js";
import { dialogListChapter } from "../handle/dialog-list-chapter.js";
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



  // Dialog chapter style
  new CustomChapter()

  // Dialog chapter list
  await dialogListChapter()



  // Initializing Replacement Modal
  modalReplacement()





  const chapterPage = document.querySelector('.page')

  // Roda a função de substituição, se houver alguma alteração nos textos (google translate)
  observerDomChanges(chapterPage, () => {
    applyReplacementListToChapter(chapterPage)
  })

  // Roda a função de substituição quando a pagina carregar
  applyReplacementListToChapter(chapterPage)
}

await main()
