import { modalChapterList } from "../components/modal-chapter-list/index.js";
import { modalChapterStyle } from "../components/modal-chapter-style/index.js";
import { modalReplacement } from "../components/modal-replace/index.js";
import { applyUserStyles } from "../core/chapter-style-setting/apply-user-style.js";
import { ChapterHistory } from "../core/history/chapter-history.js";
import { applyUserReplacements } from "../core/replacement/apply-user-replacements.js";
import { ShortcutKeyboardNavigation } from "../core/shortcuts/keyboard/navigation.js";

import { ShortcutTouchShowFloatingNavigation } from "../core/shortcuts/touch/show-floating-navigation.js";


const initChapterPage = async () => { 

  // === Attach modais ===
  modalChapterStyle() 
  modalReplacement()
  modalChapterList() 



  // === User Tools ===
  applyUserReplacements()
  applyUserStyles()

  const info = window.dragoid_info;
  if(info){
    const history = new ChapterHistory()

    history.add(info.novelTitle, {
      chapterTitle: info.chapterTitle,
      chapterUrl: info.chapterUrl
    })
  }


  // Shortcut Keyboard Navigation
  const prevChapterLink = document.querySelector('.nav-prev')
  const nextChapterLink = document.querySelector('.nav-next')
  const prevId = prevChapterLink.dataset.id
  const nextId = nextChapterLink.dataset.id
  new ShortcutKeyboardNavigation({
    prev_chapter: prevId,
    next_chapter: nextId
  })

  // Shortcut to showing float navigation menu (mobile)
  new ShortcutTouchShowFloatingNavigation() 
}

await initChapterPage()
