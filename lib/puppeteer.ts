const puppeteerInstance = async () => {
  try {
    const StealthPlugin = await import('puppeteer-extra-plugin-stealth')
    const puppeteer = await import('puppeteer-extra')

    const StealthPluginDefault = StealthPlugin.default;
    const puppeteerDefault = puppeteer.default

    if (puppeteerDefault?.use && StealthPluginDefault) {
      puppeteerDefault.use(StealthPluginDefault())
    }

    if(!puppeteer?.launch){
      console.error('System not supported by puppetter, try another bot');
      process.exit(1);
    }

    return puppeteer

  } catch (error) {
    console.error('System not supported by puppetter, try another bot');
    process.exit(1);
  }
}

export { puppeteerInstance }