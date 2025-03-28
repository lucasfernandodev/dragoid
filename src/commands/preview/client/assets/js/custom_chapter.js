export class CustomChapter {
  buttonShowModal = document.querySelector('.button-mcc');
  buttonCloseDialog = document.querySelector('.close-dialog');
  buttonDialogSubmit = document.querySelector('.dialog-submit');

  storage = {
    save: (data = []) => window.localStorage.setItem('chapter-style', JSON.stringify(data)),
    retrive: () => JSON.parse(window.localStorage.getItem('chapter-style')),
  }

  updateCSS = () => {
    const values = this.storage.retrive() || []
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

  dialog = {
    show: () => {
      const dialog = document.querySelector('.dialog');
      dialog.setAttribute('data-hidden', 'false')
    },
    hidden: () => {
      setTimeout(() => {
        const dialog = document.querySelector('.dialog');
        dialog.setAttribute('data-hidden', 'true')
      }, 100)
    }
  }

  setInitialValues = () => {
    const values = this.storage.retrive() || []
    const dialog = document.querySelector('.dialog');
    const selectList = Array.from(dialog.querySelectorAll('select'))

    values.forEach((value, index) => {
      const option = selectList[index].querySelector(`option[value="${value}"]`);
      if (option) {
        option.selected = true
      }
    })
    this.updateCSS()
  }


  attachEvents = () => {
    // Open Dialog
    this.buttonShowModal.addEventListener('click', () => {
      const dialog = document.querySelector('.dialog');
      const view = dialog.getAttribute('data-hidden');
      view === 'true' ? this.dialog.show() : this.dialog.hidden()
    })

    // Close Dialog
    this.buttonCloseDialog.addEventListener('click', () => this.dialog.hidden);

    // Update Style
    this.buttonDialogSubmit.addEventListener('click', () => {
      const dialog = document.querySelector('.dialog');
      const selectList = dialog.querySelectorAll('select');
      const selectValues = Array.from(selectList).map(el => Number.parseInt(el.value));
      this.storage.save(selectValues);

      this.updateCSS()
      this.dialog.hidden()
    })
  }

  constructor() {
    this.setInitialValues()
    this.attachEvents()
  }
}