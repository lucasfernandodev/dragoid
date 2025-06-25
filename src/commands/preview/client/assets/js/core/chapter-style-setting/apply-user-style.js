import { ChapterStyleSettingStorage } from "./storage.js";

export const applyUserStyles = () => {
  const updateCss = () => {
    const root = document.documentElement;
    const parseValues = (value) => (value / 10).toString()
    const storage = new ChapterStyleSettingStorage();
    const data = storage.get()

    if (!data) return;

    // Set fontSize
    if (data?.fontSize) {
      const value = `${parseValues(data?.fontSize)}rem`;
      const currentValue = root.style.getPropertyValue("--font-size")
      value !== currentValue && root.style.setProperty("--font-size", value)
    }

    if (data?.lineHeight) {
      const value = `${parseValues(data?.lineHeight)}rem`;
      const currentValue = root.style.getPropertyValue("--line-height")
      value !== currentValue && root.style.setProperty("--line-height", value)
    }

    if (data?.paragraphGap) {
      const value = `${parseValues(data?.paragraphGap)}rem`;
      const currentValue = root.style.getPropertyValue("--paragraph-gap")
      currentValue !== value && root.style.setProperty("--paragraph-gap", value)
    }

    if (data?.fontFamily) {
      const value = `var(${data?.fontFamily})`
      const currentValue = root.style.getPropertyValue("--chapter-font-current")
      value !== currentValue && root.style.setProperty('--chapter-font-current', value)
    }

    // Dark theme
    let isDarkModeActive = true;
    if (typeof data?.isDarkMode !== 'undefined') {
      isDarkModeActive = data?.isDarkMode
    }else{
       if(!window.matchMedia('(prefers-color-scheme: dark)').matches){
        isDarkModeActive = false;
       }
    }

    if (isDarkModeActive === false) {
      root.classList.add('light')
      root.classList.remove('dark')
    } else {
      root.classList.remove('light')
      root.classList.add('dark')
    } 
  }

  updateCss();

  window.addEventListener('storage-chapter-style', updateCss)
}

