import { ChapterStyleSettingStorage } from "./storage.js";

export const applyUserStyles = () => {
  const updateCss = () => {
    const storage = new ChapterStyleSettingStorage();
    const values = storage.get()

    if(values.length === 0) return;

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

  updateCss();

  window.addEventListener('storage-chapter-style', () => {
    updateCss();
  })
}