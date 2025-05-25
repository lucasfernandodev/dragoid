import { ReplacementNodeText } from "./replacement-node-text.js";
import { ReplacementStorage } from "./storage.js";

export const applyReplacementListToChapter = (chapterContent) => {
  const storage = new ReplacementStorage();
  const currentListId = window.localStorage.getItem('replacement-list-active')
  if (currentListId !== null) {
    const replacementList = storage.get(currentListId);
    if (replacementList) {
      const replacementNodeText = new ReplacementNodeText();
      replacementNodeText.execute(chapterContent, replacementList)
    }
  }
}