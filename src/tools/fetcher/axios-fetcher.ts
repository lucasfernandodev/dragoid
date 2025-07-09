import type { AxiosInstance } from "axios";
import type { IFetcher } from "./IFetcher.ts";
import axios from "axios";
import { logger } from "../../utils/logger.ts";
import { FetcherError } from "../../errors/fetcher-error.ts";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IFecherAxios extends IFetcher<string> { }

export class AxiosFetcher implements IFecherAxios {
  private client!: AxiosInstance;

  constructor(baseURL?: string) {
    this.client = axios.create({ baseURL })
    logger.debug('AxiosFetcher: Client instance started!')
  }

  public fetch = async (url: string): Promise<string> => {
    try {
      const resp = await this.client.get(url);
      return resp.data;
    } catch (error) {
      throw new FetcherError(`AxiosFetcher: Request for ${url} failed`, error)
    }
  }
}