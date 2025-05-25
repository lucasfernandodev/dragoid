import { ChapterStyleSettingStorage } from '../../core/chapter-style-setting/storage.js'
import { makeElement } from "../../utils/make-element.js";

const generateNumber = (initial, end, step = 2) => {
  const result = [];
  for (let i = initial; i <= end; i += step) {
    result.push(i);
  }
  return result;
}

const retriveValues = () => {
  const container = document.getElementById('container-chapter-style');
  const selects = container.querySelectorAll('select');
  const values = (Array.from(selects)).map(select => Number.parseInt(select.value));
  return values;
}

export const chapterStyleSetting = () => {

  const generateOptions = (label, id, values = [], selectedValue = 0) => {
    const labelEl = makeElement('label', { class: 'label', for: id }, label);
    const options = values.map(v => makeElement(
      'option',
      { value: v, selected: selectedValue === v ? true : false },
      v
    ))
    
    const select = makeElement( 'select', { class: 'select', id }, options);
    const group = makeElement('div', { class: 'group' });
    group.append(labelEl, select);
    return group;
  }

  const storage = new ChapterStyleSettingStorage();
  const valuesSaved = storage.get();

  const container = makeElement('div', { class: 'container', id: 'container-chapter-style' });
  const fontsize = generateOptions('Font Size', 'fontsize', generateNumber(16, 32), valuesSaved[0])
  const lineHeight = generateOptions('Line Height', 'lineheight', generateNumber(24, 40), valuesSaved[1])
  const paragraphGap = generateOptions('Paragraph Gap', 'gap', generateNumber(32, 64, 4), valuesSaved[2])

  const btnSubmit = makeElement('button', { type: 'submit', class: 'btn-submit' }, 'Save Changes')

  btnSubmit.onclick = () => {
    const values = retriveValues();
    storage.add(values)
  }

  container.append(fontsize, lineHeight, paragraphGap, btnSubmit);

  return container;
}