import { makeElement } from "../../../utils/make-element.js"
import { createReplacementList } from "./create-replacement-list.js";
import { replacementList } from "./replacement-list.js";


export const replacementOverview = () => {
  const overview = makeElement('section', {class: 'overview'}, [
    createReplacementList(),
    replacementList()
  ]);
  return overview;
}