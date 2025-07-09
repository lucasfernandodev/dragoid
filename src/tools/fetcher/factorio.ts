import { AxiosFetcher } from "./axios-fetcher.ts"
import { PuppetterFetcher } from "./puppeteer-fetcher.ts";

export type FetcherType = 'http' | 'browser';

export interface FetcherMap {
  http: AxiosFetcher;
  browser: PuppetterFetcher;
}

export const createFetcher = <T extends FetcherType>(type: T): FetcherMap[T] => {
  if (type === 'http') {
    return new AxiosFetcher() as FetcherMap[T]
  };
  return new PuppetterFetcher() as FetcherMap[T]
}