import { CustomChapter } from "../handle/custom_chapter.js";
import { dialogListChapter } from "../handle/dialog-list-chapter.js";
import { isMobile, onGesture } from "../utils.js";



const main = async () => {
  const isMobilewView = isMobile();
  
  if (isMobilewView) {
    const navigationMenu = document.querySelector(".floating-navigation");
    // Start gesture 
    onGesture(() => {
      navigationMenu.style.display = 'flex'
      setTimeout(() => {
        navigationMenu.style.display = "none";
      }, 1500)
    })
  }



  // Dialog chapter style
  new CustomChapter()

  // Dialog chapter list
  await dialogListChapter()
}

await main()
