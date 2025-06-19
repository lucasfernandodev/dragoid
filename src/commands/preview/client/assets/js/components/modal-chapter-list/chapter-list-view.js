import { getChapterlist } from "../../api.js";
import { ChapterHistory } from "../../core/history/chapter-history.js";
import { makeElement } from "../../utils/make-element.js";
 

export const chapterListView = async (currentChapterId) => {
  const chapters = await getChapterlist();

  const history = new ChapterHistory()
  const historyChapters = history.retrive(window.dragoid_info.novelTitle)

  const createChapterListItem = (chapter, index) => {

    const title = chapter.title
    const url = `/chapter/?id=${index}`; 

    const linkAttributes = {
      href: url,
      'data-active': currentChapterId === index,
      title: title
    }



    const chapterLink = makeElement('a', linkAttributes, [
      makeElement('span', { class: 'title' }, title)
    ])

    
    if (historyChapters) {
      const host = window.location.origin
      const isChapterRead = historyChapters[`${host}${url}`]
      const className = `item ${isChapterRead ? 'read' : ''}`
      const viewItem = makeElement('li', { class: className }, chapterLink);
      return viewItem;
    }

    const viewItem = makeElement('li', { class: 'item' }, chapterLink);
    return viewItem;
  }

  const viewList = makeElement('ul', {
    class: 'chapter-list',
    id: 'chapter-list'
  }, chapters.map(createChapterListItem));

  return viewList;
}