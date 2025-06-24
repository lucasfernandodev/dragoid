import { ChapterStyleSettingStorage } from "./storage.js";

const setTheme = () => {
  const isConfig = window.localStorage.getItem('chapter-style');
  const isDarkModePref = window.matchMedia('(prefers-color-scheme: dark)').matches
  const root = document.documentElement;

  // Não há configuração / e a preferencia é lighmode
  if (!isConfig && !isDarkModePref) {
    root.classList.add('light')
    root.classList.remove('dark')
    return;
  }

  const { isDarkMode } = isConfig ? JSON.parse(isConfig) : {}

  // A opção darkmode não existe / user prefere ligh mode
  if (typeof isDarkMode === 'undefined') {
    if (!isDarkModePref) {
      root.classList.add('light')
      root.classList.remove('dark')
    }
    return;
  }

  // O darkMode está desativado
  if (isDarkMode === false) {
    root.classList.add('light')
    root.classList.remove('dark')
  }else{
    root.classList.remove('light')
    root.classList.add('dark')
  }
}

export const applyUserStyles = () => {
  const updateCss = () => {
    const storage = new ChapterStyleSettingStorage();
    const data = storage.get()

    if (!data) return;

    const root = document.documentElement;

    const parseValues = (value) => (value / 10).toString()

    // Set fontSize
    if (data?.fontSize) {
      const value = `${parseValues(data?.fontSize)}rem`;
      root.style.setProperty("--font-size", value)
    }

    if (data?.lineHeight) {
      const value = `${parseValues(data?.lineHeight)}rem`;
      root.style.setProperty("--line-height", value)
    }

    if (data?.paragraphGap) {
      const value = `${parseValues(data?.paragraphGap)}rem`;
      root.style.setProperty("--paragraph-gap", value)
    }

    setTheme()
  }

  updateCss();

  window.addEventListener('storage-chapter-style', () => {
    updateCss();
  })
}

