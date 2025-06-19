export class ChapterHistory {
  #history = {};

  #onUpdate = () => {
    window.localStorage.setItem('history', JSON.stringify(this.#history))
  }


  retrive = (novelTitle) => {
    return this.#history[novelTitle] || null
  }


  add = (novelTitle, data = {}) => {
    const { chapterTitle, chapterUrl } = data;
    if (!this.#history[novelTitle]) {
      this.#history[novelTitle] = {}
    }

    this.#history[novelTitle][chapterUrl] = {
      chapterTitle: chapterTitle,
      chapterUrl: chapterUrl,
      updateAt: new Date().toISOString(),
    }

    this.#onUpdate()
  }

  constructor() {
    const historyStorage = window.localStorage.getItem('history');
    if (!historyStorage) {
      this.#history = {}
      return;
    }

    try {
      this.#history = JSON.parse(historyStorage);
    } catch (error) {
      this.#history = {};
      console.error("Failed to parse history from localStorage:", error)
    }
  }
}