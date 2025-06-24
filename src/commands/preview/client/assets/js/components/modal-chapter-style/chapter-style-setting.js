import { ChapterStyleSettingStorage } from '../../core/chapter-style-setting/storage.js'
import { makeElement } from "../../utils/make-element.js";

const generateNumber = (initial, end, step = 2) => {
  const result = [];
  for (let i = initial; i <= end; i += step) {
    result.push(i);
  }
  return result;
}

const retriveValues = (id) => {
  const container = document.getElementById(id);
  const selects = container.querySelectorAll('select');
  const values = (Array.from(selects)).map(select => Number.parseInt(select.value));
  return values;
}

const generateOptions = (label, id, values = [], selectedValue = 0) => {
  const labelEl = makeElement('label', { class: 'label', for: id }, label);
  const options = values.map(v => makeElement(
    'option',
    { value: v, selected: selectedValue === v ? true : false },
    v
  ))

  const select = makeElement('select', { class: 'select', id }, options);
  const group = makeElement('div', { class: 'group' });
  group.append(labelEl, select);
  return group;
}



export const chapterStyleSetting = () => {
  const storage = new ChapterStyleSettingStorage();
  const valuesSaved = storage.get();
  const viewSettingId = 'chapter-setting-container'

  const container = makeElement('div', { class: 'container', id: viewSettingId });

  // Options
  const fontsize = generateOptions(
    'Font size:',
    'fontsize',
    generateNumber(16, 32), valuesSaved.fontSize
  )

  const lineHeight = generateOptions(
    'Line height:',
    'lineheight',
    generateNumber(24, 40),
    valuesSaved.lineHeight
  )

  const paragraphGap = generateOptions(
    'Space between paragraphs:',
    'gap',
    generateNumber(32, 64, 4),
    valuesSaved.paragraphGap
  )

  const usignDarkTheme = () => {
    const label = makeElement('label', { class: 'label', for: '#dark-mode' }, 'Dark theme:')
    const input = makeElement('input', {
      class: 'switch',
      id: 'dark-mode',
      role: 'switch',
      type: 'checkbox',
      checked: valuesSaved.isDarkMode
    })

    const group = makeElement('div', { class: 'group row' }, [label, input]);
    return group;
  }

  // Submit
  const btnSubmit = makeElement('button', { type: 'submit', class: 'btn-submit' }, 'Save Changes')

  btnSubmit.onclick = () => {
    const values = retriveValues(viewSettingId);
    const isDarkModeActive = document.getElementById('dark-mode');
    storage.add({
      fontSize: values[0],
      lineHeight: values[1],
      paragraphGap: values[2],
      isDarkMode: isDarkModeActive.checked
    })
  }

  container.append(fontsize, lineHeight, paragraphGap, usignDarkTheme(), btnSubmit);

  return container;
}