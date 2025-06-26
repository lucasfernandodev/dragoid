import { observerDomChanges } from "../observer-dom-changes.js";
import { ReplacementNodeText } from "./replacement-node-text.js";
import { ReplacementStorage } from "./storage.js";

export const applyUserReplacements = () => { 

  const executeReplacement = (rootElement) => {
    const storage = new ReplacementStorage();
    const currentListId = window.localStorage.getItem('replacement-list-active')
    if (currentListId !== null) {
      const replacementList = storage.get(currentListId);
      if (replacementList) {
        const replacementNodeText = new ReplacementNodeText();
        replacementNodeText.execute(rootElement, replacementList)
      }
    }
  }

  const chapterPage = document.querySelector('#chapter .content')

  // Roda a função de substituição, se houver alguma alteração nos textos (google translate)
  observerDomChanges(chapterPage, () => {
    executeReplacement(chapterPage)
  })

  // Roda a função de substituição quando a pagina carregar
  executeReplacement(chapterPage)
}