import { applyUserStyles } from "../core/chapter-style-setting/apply-user-style.js"
import { ChapterHistory } from "../core/history/chapter-history.js";
import { applyUserReplacements } from "../core/replacement/apply-user-replacements.js"; 

const initChapterPage = async () => {
  applyUserStyles()
  applyUserReplacements()

  const info = window.dragoid_info;

  // Save first chapter
  if (info) {
    const history = new ChapterHistory()

    history.add(info.novelTitle, {
      chapterTitle: info.chapterTitle,
      chapterUrl: info.chapterUrl
    })
  }
}

window.onload = async () => {
  await initChapterPage()
}