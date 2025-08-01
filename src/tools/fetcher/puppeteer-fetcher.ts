import 'dotenv/config'
import * as puppeteer from "puppeteer-core";
import type { IFetcher } from "./IFetcher.ts";
import { logger } from "../../utils/logger.ts";
import { FetcherError } from "../../errors/fetcher-error.ts";
import { puppeteerInstance } from "../../lib/puppeteer.ts";
import { delay } from "../../utils/delay.ts";

export interface IFecherPupeetter extends IFetcher<string> {
  closeBrowser: () => Promise<void>
}



export class PuppetterFetcher implements IFecherPupeetter {
  private browser?: puppeteer.Browser;
  private launching: Promise<puppeteer.Browser> | null = null;

  private getBrowser = async (): Promise<puppeteer.Browser> => {

    // Custom browser path
    const PUPPETEER_BROWSER_PATH = process.env.PUPPETEER_BROWSER_PATH || null;
    const customBrowser = {} as {'executablePath': string};
    if(PUPPETEER_BROWSER_PATH && PUPPETEER_BROWSER_PATH.trim()){
      customBrowser.executablePath = PUPPETEER_BROWSER_PATH
    }

    if (this.browser) return this.browser;
    if (!this.launching) {
      const puppeteerIntance = await puppeteerInstance() as unknown as typeof puppeteer
      this.launching = puppeteerIntance.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-gpu',
          '--no-zygote',
          '--disable-software-rasterizer',
          '--disable-features=VizDisplayCompositor'
        ],
        protocolTimeout: 60000 * 4,
        ...customBrowser
      });
    }
    this.browser = await this.launching;
    logger.debug('PuppetterFetcher: Browser started')
    return this.browser;
  }

  public closeBrowser: () => Promise<void> = async () => {
    if (this.browser) {
      await this.browser.close();
      this.browser = undefined;
      this.launching = null;
      logger.debug('PuppetterFetcher: Browser close')
    }
  };

  public fetch = async (url: string): Promise<string> => {
    const browser = await this.getBrowser();
    const page = await browser.newPage();
    const cookies = await browser.cookies();
    await browser.deleteCookie(...cookies);

    await page.setViewport({
      width: Math.floor(1024 + Math.random() * 100),
      height: Math.floor(768 + Math.random() * 100),
    });

    try {
      await page.goto(url, { timeout: 60000 })
      const body = await page.waitForSelector('body', { timeout: 60000 });

      if (!body) {
        await delay(5000)
        await page.reload()
        await page.waitForSelector('body', { timeout: 10000 })
      }


      await page.evaluate(() => {
        window.localStorage.clear()
      })

      const content = await page.content();

      await page.close()
      return content;
    } catch (error: unknown) {
      await page.close()
      await this.closeBrowser()
      throw new FetcherError(`PuppetterFetcher: Request for ${url} failed`, error)
    }
  }
}