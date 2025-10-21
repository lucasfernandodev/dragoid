import type { AxiosInstance } from 'axios'
import type { IFetcher } from './IFetcher.ts'
import axios from 'axios'
import { FetcherError } from '../../errors/fetcher-error.ts'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IFetcherAxios extends IFetcher<string> {}

export class AxiosFetcher implements IFetcherAxios {
  private client!: AxiosInstance

  constructor(baseURL?: string) {
    this.client = axios.create({ baseURL })
  }

  public fetch = async (url: string): Promise<string> => {
    try {
      const resp = await this.client.get(url)
      return resp.data
    } catch (error) {
      throw new FetcherError(`AxiosFetcher: Request for ${url} failed`, error)
    }
  }
}
