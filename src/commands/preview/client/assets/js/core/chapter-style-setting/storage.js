export class ChapterStyleSettingStorage {
  #storage = [];
  #name = 'chapter-style'

  #store = () => {
    window.localStorage.setItem(this.#name, JSON.stringify(this.#storage))
    window.dispatchEvent(new Event('storage-chapter-style'))
  }

  #load = () => {
    const storaged = window.localStorage.getItem(this.#name)
    if (!storaged) {
      this.#storage = []
      return;
    }

    this.#storage = JSON.parse(storaged)
  }

  add = (options = []) => {
    this.#storage = options;
    this.#store()
  }
 
  get = () => {
    return this.#storage
  }

  update = (options = []) => {
    this.#storage = options;
    this.#store();
  } 

  size = () => {
    return Object.entries(this.#storage).length
  }

  constructor() {
    this.#load()
  }
}