import { CustomChapter } from "./custom_chapter.js";
import { isMobile, onGesture } from "./utils.js";

const customizeChapter = () => {
  // Button to toggle view of modal customize chapter;
  const buttonShowModal = document.querySelector('.button-mcc');
  const buttonCloseDialog = document.querySelector('.close-dialog');
  const buttonDialogSubmit = document.querySelector('.dialog-submit');

  const showDialog = () => {
    const dialog = document.querySelector('.dialog');
    dialog.setAttribute('data-hidden', 'false')
  }

  const hiddenDialog = () => {
    setTimeout(() => {
      const dialog = document.querySelector('.dialog');
      dialog.setAttribute('data-hidden', 'true')
    }, 100)
  }

  buttonShowModal.addEventListener('click', () => {
    const dialog = document.querySelector('.dialog');
    const view = dialog.getAttribute('data-hidden');
    console.log('view', view)
    view === 'true' ? showDialog() : hiddenDialog()
  })

  const storage = {
    save: (data = []) => window.localStorage.setItem('chapter-style', JSON.stringify(data)),
    retrive: () => JSON.parse(window.localStorage.getItem('chapter-style')),
  }

  const updateCSS = () => {
    const values = storage.retrive() || []
    const root = document.documentElement;
    if (values.length === 0) return;

    const parseValues = (value) => (value / 10).toString()

    const fontSize = values[0];
    const lineHeight = values[1];
    const paragraphGap = values[2];

    root.style.setProperty("--font-size", `${parseValues(fontSize)}rem`)
    root.style.setProperty("--line-height", `${parseValues(lineHeight)}rem`)
    root.style.setProperty("--paragraph-gap", `${parseValues(paragraphGap)}rem`)
  }

  buttonCloseDialog.addEventListener('click', hiddenDialog)

  const collectUpdatedStyle = () => {
    const dialog = document.querySelector('.dialog');
    const selectList = dialog.querySelectorAll('select');
    const selectValues = Array.from(selectList).map(el => Number.parseInt(el.value));
    storage.save(selectValues);
  }

  const loadSavedValues = () => {
    const values = storage.retrive() || [];
    const dialog = document.querySelector('.dialog');
    const selectList = Array.from(dialog.querySelectorAll('select'))

    const setSelectedOption = (select, value) => {
      const option = select.querySelector(`option[value="${value}"]`);
      if (option) {
        option.selected = true
      }
    }

    values.forEach((value, index) => {
      setSelectedOption(selectList[index], value)
    })
    updateCSS()
  }

  buttonDialogSubmit.addEventListener('click', () => {
    collectUpdatedStyle()
    updateCSS()
    hiddenDialog()
  })

  loadSavedValues()
}


const main = () => {
  const isMobilewView = isMobile();
  if (!isMobilewView) return;

  const navigationMenu = document.querySelector(".navigation-chapters");

  onGesture(() => {
    navigationMenu.style.display = 'flex'
    setTimeout(() => {
      navigationMenu.style.display = "none";
    }, 1500)
  })


}

main()
new CustomChapter()