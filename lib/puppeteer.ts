import StealthPlugin from 'puppeteer-extra-plugin-stealth';
 



const puppeteerInstance = async () => {
  try {
    const puppeteer = (await import('puppeteer-extra')).default as any
    if (puppeteer?.use) {
      puppeteer.use(StealthPlugin())
    }

    return puppeteer

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

export { puppeteerInstance }