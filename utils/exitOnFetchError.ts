import { logger } from "./logger.ts";

export const axiosComplements = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
    'Referer': 'https://exemplo.com'
  },
  withCredentials: true
}

export const exitOnFetchError = async <T>(func: () => Promise<T>) => {
  try {
    const response = await func();
    return response;
  } catch (error) {
    console.log(error)
    logger.error(
      `[x] An error occurred with the request: check if the url is correct or if the site is online`,
      1,
      true);
  }
}