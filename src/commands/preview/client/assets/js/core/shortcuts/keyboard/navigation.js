export class ShortcutKeyboardNavigation {
  #prev_chapter = null;
  #next_chapter = null;

  #navigateToPrev = () => {
    window.location.href = `/chapter/?id=${this.#prev_chapter}`
  }

  #navigateToNext = () => {
    window.location.href = `/chapter/?id=${this.#next_chapter}`
  }

  #executeNavigation = (to) => {
    if (to === 'next' && this.#next_chapter !== null) {
      if (!isNaN(this.#next_chapter) && this.#next_chapter.length > 0) {
        this.#navigateToNext()
      }
    }

    if (to === 'prev' && this.#prev_chapter !== null) {
      if (!isNaN(this.#prev_chapter) && this.#prev_chapter.length > 0) {
        this.#navigateToPrev()
      }
    }
  }

  #listenKeyboard = () => {
    const handle = (ev) => {
      ev.key === 'ArrowLeft' && this.#executeNavigation('prev');
      ev.key === 'ArrowRight' && this.#executeNavigation('next');
    }

    document.addEventListener('keydown',handle);
  }


  constructor(navigation = { prev_chapter: null, next_chapter: null }) {
    this.#prev_chapter = navigation.prev_chapter;
    this.#next_chapter = navigation.next_chapter;
    this.#listenKeyboard()
  }
}