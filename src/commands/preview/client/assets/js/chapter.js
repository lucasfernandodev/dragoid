import { CustomChapter } from "./custom_chapter.js";
import { isMobile, onGesture } from "./utils.js";


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