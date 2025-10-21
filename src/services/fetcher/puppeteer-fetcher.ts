import 'dotenv/config'
import * as puppeteer from 'puppeteer-core'
import type { IFetcher } from './IFetcher.ts'
import { logger } from '../../utils/logger.ts'
import { FetcherError } from '../../errors/fetcher-error.ts'
import { puppeteerInstance } from '../../lib/puppeteer.ts'
import { delay } from '../../utils/delay.ts'

export interface IFetcherPuppeteer extends IFetcher<string> {
  closeBrowser: () => Promise<void>
}

export class PuppeteerFetcher implements IFetcherPuppeteer {
  private browser?: puppeteer.Browser
  private launching: Promise<puppeteer.Browser> | null = null
  private cookieStore: Record<string, unknown> | null = null

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

  public closeBrowser: () => Promise<void> = async () => {
    if (this.browser) {
      await this.browser.close()
      this.browser = undefined
      this.launching = null
      logger.debug('PuppeteerFetcher: Browser close')
    }
  }

  public fetch = async (url: string): Promise<string> => {
    const browser = await this.getBrowser()
    let page = await browser.newPage()

    if (this.cookieStore) {
      await page.setCookie(
        ...Object.values(this.cookieStore as unknown as puppeteer.CookieParam)
      )
    }

    await page.setExtraHTTPHeaders({
      'accept-language': 'en-US,en;q=0.9',
    })

    // viewport plausível
    await page.setViewport({
      width: 1200,
      height: 800,
    })

    try {
      await page.goto(url, { timeout: 60000 })
      const body = await page.waitForSelector('body', { timeout: 60000 })

      if (!body) {
        await delay(30000)
        await page.reload()
        await page.waitForSelector('body', { timeout: 10000 })
      }

      try {
        const cookies = await page.cookies()
        // armazene de forma simples

        this.cookieStore = cookies.reduce(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (acc: Record<string, unknown>, c: any) => {
            acc[c.name] = c
            return acc
          },
          {}
        )
      } catch (_) {
        // ignore
      }

      const isTitle = (await page.title()) || ''

      if (isTitle.trim().length === 0) {
        logger.debug('Puppeteer return empty page')
        await page.close()
        await this.closeBrowser()

        await delay(5000)

        const browser = await this.getBrowser()
        page = await browser.newPage()

        try {
          await page.goto(url, { timeout: 60000 })
          const body = await page.waitForSelector('body', { timeout: 60000 })

          if (!body) {
            await delay(30000)
            await page.reload()
            await page.waitForSelector('body', { timeout: 10000 })
          }

          try {
            const cookies = await page.cookies()
            // armazene de forma simples

            this.cookieStore = cookies.reduce(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (acc: Record<string, unknown>, c: any) => {
                acc[c.name] = c
                return acc
              },
              {}
            )
          } catch (_) {
            // ignore
          }

          const content = await page.content()

          await page.close()
          return content
        } catch (error: unknown) {
          await page.close()
          await this.closeBrowser()
          throw new FetcherError(
            `PuppeteerFetcher: Request for ${url} failed`,
            error
          )
        }
      }

      const content = await page.content()

      await page.close()
      return content
    } catch (error: unknown) {
      await page.close()
      await this.closeBrowser()
      throw new FetcherError(
        `PuppeteerFetcher: Request for ${url} failed`,
        error
      )
    }
  }
}
