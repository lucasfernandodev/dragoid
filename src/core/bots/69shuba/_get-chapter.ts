import { puppeteerInstance } from "../../../lib/puppeteer.ts";

 

export const getChapterIn69shuba = async (url: string) => {

  const puppeteer = await puppeteerInstance()
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: 'load',
  });

  await page.waitForSelector('h1');

  const result = await page.evaluate(() => {
    const title = document.querySelector('h1');
    const content = [] as string[];
    const container = document.querySelector(".txtnav");

    if (container) {
      container.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node?.textContent?.trim();
          if (text) content.push(text);
        }
      })
    }
    return {
      title: title?.textContent || '',
      content: content
    }
  });


  await browser.close();

  return {
    title: result.title,
    content: result.content
  }
}