const puppeteerInstance = async () => {
  try {
    const StealthPlugin = await import('puppeteer-extra-plugin-stealth')
    const puppeteer = await import('puppeteer-extra')

    const StealthPluginDefault = StealthPlugin.default;
    const puppeteerDefault = puppeteer.default

    if (puppeteerDefault?.use && StealthPluginDefault) {
      const steald = StealthPluginDefault()
      steald.enabledEvasions.delete('iframe.contentWindow')
      puppeteerDefault.use(steald)
    }

    if (!puppeteerDefault?.launch) {
      console.error('System not supported by puppetter, try another bot');
      process.exit(1);
    }



    return puppeteerDefault

  } catch (error) {
    console.error('System not supported by puppetter, try another bot');
    process.exit(1);
  }
}

export { puppeteerInstance }