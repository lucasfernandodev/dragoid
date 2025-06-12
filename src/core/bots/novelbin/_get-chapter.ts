import { BotError } from "../../../errors/bot-error.ts";
import { puppeteerInstance } from "../../../lib/puppeteer.ts";
import { collectChapter } from "./parse-html/collect-chapter.ts";

export const _getChapter = async (url: string) => {
  const puppeteer = await puppeteerInstance()
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: 'load',
  });

  await page.waitForSelector('h1');

  const chapter = await page.evaluate(collectChapter);

  if(!chapter){
    await browser.close();
    throw new BotError('Retrive chapter failed')
  }

  await browser.close();
  return chapter;
}