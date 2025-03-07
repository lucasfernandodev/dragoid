import { logger } from "./logger.ts";

export const exitOnFetchError = async <T>(func: () => Promise<T>) => {
  try {
    const response = await func();
    return response;
  } catch (error) {
    logger.error(
      `[x] An error occurred with the request: check if the url is correct or if the site is online`,
      1,
      true);
  }
}