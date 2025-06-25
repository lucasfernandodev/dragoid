import { ChapterStyleSettingStorage } from '../../core/chapter-style-setting/storage.js'
import { generateNumber } from '../../utils/generate-number.js';
import { makeElement } from "../../utils/make-element.js";



const retriveValues = (id) => {
  const container = document.getElementById(id);
  const selects = container.querySelectorAll('select');
  const values = (Array.from(selects)).map(select => {
    if (!isNaN(Number.parseInt(select.value))) {
      return Number.parseInt(select.value)
    }
    return select.value
  });
  return values;
}

const generateOptions = (label, id, values = [], selectedValue = 0) => {
  const labelEl = makeElement('label', { class: 'label', for: id }, label);
  const options = values.map(v => {
    const attributes = { value: v, selected: selectedValue === v ? true : false }
    return makeElement('option', attributes, v)
  })

  const select = makeElement('select', { class: 'select', id }, options);
  const group = makeElement('div', { class: 'group' }, [labelEl, select]);
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

  const selectDarkTheme = () => {
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

  const selectFontFamily = (currentfontFamily = '') => {
    const makeOption = (label, value, currentfontFamily) => {
      return makeElement('option', { value: value, selected: value === currentfontFamily }, label)
    }

    const label = makeElement('label', { class: 'label', for: '#fontFamily' }, 'Select font family:')
    const select = makeElement('select', { class: 'select', id: '#fontFamily' }, [
      makeOption('Merriweather', "--chapter-font-primary", currentfontFamily),
      makeOption('Nunito', "--chapter-font-secondary", currentfontFamily)
    ]);

    const group = makeElement('div', { class: 'group' }, [label, select]);
    return group
  }

  // Submit
  const btnSubmit = makeElement('button', { type: 'submit', class: 'btn-submit' }, 'Save Changes')

  btnSubmit.onclick = () => {
    const values = retriveValues(viewSettingId);
    storage.add({
      fontSize: values[0],
      lineHeight: values[1],
      paragraphGap: values[2],
      isDarkMode: document.getElementById('dark-mode')?.checked || false,
      fontFamily: values[3]
    })
  }


  container.append(
    fontsize,
    lineHeight,
    paragraphGap,
    selectFontFamily(valuesSaved?.fontFamily),
    selectDarkTheme(),
    btnSubmit
  );

  return container;
}