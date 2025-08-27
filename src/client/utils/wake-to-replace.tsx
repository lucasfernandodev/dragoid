import type { ReplacementList } from "../../types/front-end/replacement-list.ts";

type List = ReplacementList['list']

export const walkeToReplace = (
  rootElement: HTMLElement,
  replacementList = {} as List
) => {
  const walker = document.createTreeWalker(
    rootElement,
    NodeFilter.SHOW_TEXT,
    null,
  )

  let node;
  while (node = walker.nextNode()) {
    let newString = node.nodeValue;
    for (const [from, to] of Object.entries(replacementList)) {
      if (!newString) continue;
      if (newString.includes(from)) {
        newString = newString.replaceAll(from, to)
        if (node.parentElement) {
          node.parentElement.dataset.processed = 'true'
        }
      }

      node.nodeValue = newString;
    }
  }
}