import { isMobile } from "../../../utils/is-Mobile.js";

export class ShortcutTouchShowFloatingNavigation {
  #isMobileView = isMobile();

  #execute = () => {
    const hiddenNavigationDelay = 1500;

    if (this.#isMobileView) {
      const navigationMenu = document.querySelector(".floating-navigation");
      navigationMenu.style.display = 'flex'
      setTimeout(() => {
        navigationMenu.style.display = "none";
      }, hiddenNavigationDelay)
    }
  }

  #listenTouch = () => {
    let touchCount = 0; // Contador de toques
    const touchDelay = 500; // Tempo máximo entre toques (em milissegundos)

    function resetTouchCount() {
      touchCount = 0;
    }

    const handle = () => {
      touchCount++;

      if (touchCount === 3) {
        this.#execute();
        resetTouchCount();
        return;
      }

      setTimeout(() => {
        resetTouchCount();
      }, touchDelay);
    }

    document.addEventListener('touchstart', handle)
  }

  constructor(){
    this.#listenTouch()
  }
}