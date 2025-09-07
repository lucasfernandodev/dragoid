import { logger } from '../utils/logger.ts';

const puppeteerInstance = async () => {
  try {
    const StealthPlugin = await import('puppeteer-extra-plugin-stealth')
    const puppeteer = await import('puppeteer-extra')

    const StealthPluginDefault = StealthPlugin.default;
    const puppeteerDefault = puppeteer.default

    if ('use' in puppeteerDefault && StealthPluginDefault) {
      const stealth = StealthPluginDefault()
      stealth.enabledEvasions.delete('iframe.contentWindow')
      if (typeof puppeteerDefault.use === 'function') {
        puppeteerDefault.use(stealth)
        logger.debug("Puppeteer is now using stealth mode")
      } else {
        logger.debug("Puppeteer not using stealth mode")
      }
    }

    if (!('launch' in puppeteerDefault)) {
      console.error('System not supported by puppeteer, try another bot');
      process.exit(1);
    }

    return puppeteerDefault

  } catch (_) {
    console.error('System not supported by puppeteer, try another bot');
    process.exit(1);
  }
}

export { puppeteerInstance }