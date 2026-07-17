import 'dotenv/config'
import * as puppeteer from 'puppeteer-core'
import type { IFetcher } from './IFetcher.ts'
import { logger } from '../../utils/logger.ts'
import { FetcherError } from '../../errors/fetcher-error.ts'
import { puppeteerInstance } from '../../lib/puppeteer.ts'
import { delay } from '../../utils/delay.ts'
import { isCloudflare } from '../../utils/is-cloudflare.ts'

export interface IFetcherPuppeteer extends IFetcher<string> {
  closeBrowser: () => Promise<void>
}

export class PuppeteerFetcher implements IFetcherPuppeteer {
  private browser?: puppeteer.Browser
  private launching: Promise<puppeteer.Browser> | null = null
  private cookieStore: Record<string, unknown> | null = null
  private page?: puppeteer.Page
  private pageUses = 0

  private static readonly MAX_PAGE_USES = 10

  private getBrowser = async (): Promise<puppeteer.Browser> => {
    // Custom browser path
    const PUPPETEER_BROWSER_PATH = process.env.PUPPETEER_BROWSER_PATH || null
    const customBrowser = {} as { executablePath: string }
    if (PUPPETEER_BROWSER_PATH && PUPPETEER_BROWSER_PATH.trim()) {
      customBrowser.executablePath = PUPPETEER_BROWSER_PATH
    }

    if (this.browser) return this.browser
    if (!this.launching) {
      const _puppeteerInstance =
        (await puppeteerInstance()) as unknown as typeof puppeteer
      this.launching = _puppeteerInstance.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-gpu',
          '--no-zygote',
          '--disable-software-rasterizer',
          '--disable-features=VizDisplayCompositor',
        ],
        protocolTimeout: 60000 * 4,
        ...customBrowser,
      })
    }
    this.browser = await this.launching
    logger.debug('PuppeteerFetcher: Browser started')
    return this.browser
  }

  public closeBrowser = async () => {
    try {
      if (this.page && !this.page.isClosed()) {
        await this.page.close()
      }
    } catch {
      // ignore
    }

    this.page = undefined
    this.pageUses = 0

    if (this.browser) {
      await this.browser.close()
      this.browser = undefined
      this.launching = null

      logger.debug('PuppeteerFetcher: Browser closed')
    }
  }

  private getPage = async (): Promise<puppeteer.Page> => {
    const browser = await this.getBrowser()

    if (
      !this.page ||
      this.page.isClosed() ||
      this.pageUses >= PuppeteerFetcher.MAX_PAGE_USES
    ) {
      if (this.page && !this.page.isClosed()) {
        try {
          await this.page.close()
        } catch {
          // ignore
        }
      }

      this.page = await browser.newPage()
      this.pageUses = 0

      if (this.cookieStore) {
        await this.page.setCookie(
          ...Object.values(this.cookieStore as unknown as puppeteer.CookieParam)
        )
      }

      await this.page.setExtraHTTPHeaders({
        'accept-language': 'en-US,en;q=0.9',
      })

      await this.page.setViewport({
        width: 1200,
        height: 800,
      })

      logger.debug('PuppeteerFetcher: New page created')
    }

    this.pageUses++

    return this.page
  }

  private fetchOnce = async (url: string): Promise<string> => {
    const page = await this.getPage()

    try {
      // Limpa estado da página anterior
      await page.goto('about:blank', {
        waitUntil: 'domcontentloaded',
      })

      // Pequeno atraso aleatório
      await delay(500 + Math.random() * 1500)

      await page.goto(url, {
        timeout: 60000,
        waitUntil: 'domcontentloaded',
      })

      await page.waitForSelector('body', {
        timeout: 60000,
      })

      // Simula um usuário lendo um pouco
      await delay(800 + Math.random() * 2000)

      await page.evaluate(() => {
        window.scrollBy({
          top: window.innerHeight * 0.6,
          behavior: 'instant',
        })
      })

      await delay(500 + Math.random() * 1500)

      try {
        const cookies = await page.cookies()

        this.cookieStore = cookies.reduce(
          (acc: Record<string, unknown>, c: puppeteer.Cookie) => {
            acc[c.name] = c
            return acc
          },
          {}
        )
      } catch {
        // ignore
      }

      const title = await page.title()

      if (!title.trim()) {
        logger.debug('Empty title, restarting browser.')

        await this.closeBrowser()

        this.page = undefined
        this.pageUses = 0

        await delay(5000)

        return this.fetchOnce(url)
      }

      return await page.content()
    } catch (error) {
      try {
        if (this.page && !this.page.isClosed()) {
          await this.page.close()
        }
      } catch {
        // ignore
      }

      this.page = undefined
      this.pageUses = 0

      await this.closeBrowser()

      throw new FetcherError(
        `PuppeteerFetcher: Request for ${url} failed`,
        error
      )
    }
  }

  public fetch = async (url: string): Promise<string> => {
    const MAX_ATTEMPTS = 4
    const BASE_DELAY = 3 * 60 * 1000 // 3 minutos

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const content = await this.fetchOnce(url)

      if (!isCloudflare(content)) {
        return content
      }

      // Não aguarda após a última tentativa
      if (attempt === MAX_ATTEMPTS) {
        break
      }

      const waitTime = BASE_DELAY * attempt

      logger.warning(
        `Cloudflare challenge detected (attempt ${attempt}/${MAX_ATTEMPTS}). ` +
          `Restarting browser and waiting ${waitTime / 60000} minutes before retrying...`
      )

      await this.closeBrowser()
      await delay(waitTime)
    }

    await this.closeBrowser()

    throw new FetcherError(
      `Cloudflare challenge persisted after ${MAX_ATTEMPTS} attempts.`
    )
  }
}
