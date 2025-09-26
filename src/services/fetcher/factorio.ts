import { AxiosFetcher } from "./axios-fetcher.ts"
import { PuppeteerFetcher } from "./puppeteer-fetcher.ts";

export type FetcherType = 'http' | 'browser';

export interface FetcherMap {
  http: AxiosFetcher;
  browser: PuppeteerFetcher;
}

export const createFetcher = <T extends FetcherType>(type: T): FetcherMap[T] => {
  if (type === 'http') {
    return new AxiosFetcher() as FetcherMap[T]
  };
  return new PuppeteerFetcher() as FetcherMap[T]
}