import { logger } from '../utils/logger.ts';

const puppeteerInstance = async () => {
  try {
    const StealthPlugin = await import('puppeteer-extra-plugin-stealth')
    const puppeteer = await import('puppeteer-extra')

    const StealthPluginDefault = StealthPlugin.default;
    const puppeteerDefault = puppeteer.default

    if ('use' in puppeteerDefault && StealthPluginDefault) {
      const steald = StealthPluginDefault()
      steald.enabledEvasions.delete('iframe.contentWindow')
      if (typeof puppeteerDefault.use === 'function') {
        puppeteerDefault.use(steald)
        logger.info("Puppetter is now using steald mode")
      } else {
        logger.info("Puppetter not using steald mode")
      }
    }

    if (!('launch' in puppeteerDefault)) {
      console.error('System not supported by puppetter, try another bot');
      process.exit(1);
    }

    return puppeteerDefault

  } catch (_) {
    console.error('System not supported by puppetter, try another bot');
    process.exit(1);
  }
}

export { puppeteerInstance }