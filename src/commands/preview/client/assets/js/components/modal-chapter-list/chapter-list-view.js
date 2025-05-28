import { getChapterlist } from "../../api.js";
import { makeElement } from "../../utils/make-element.js";

export const chapterListView = async (currentChapterId) => {
  const chapters = await getChapterlist();

  const viewListItens = chapters.map((chapter, index) => {
    const isActive = currentChapterId === index;

    const viewTitle = makeElement('span', {class: 'title'}, chapter.title)

    const viewLink = makeElement(
      'a',
      {
        href: `/chapter/?id=${index}`,
        'data-active': isActive,
        title: chapter.title
      },
      viewTitle
    )

    const viewItem = makeElement('li', {class: 'item'}, viewLink);
    return viewItem;
  })

  const viewList = makeElement(
    'ul',
    {
      class: 'chapter-list',
      id: 'chapter-list'
    },
    viewListItens
  );

  return viewList;
}