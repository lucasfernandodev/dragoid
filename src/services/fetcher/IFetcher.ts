export interface IFetcher<T> {
  fetch(url: string): Promise<T>; 
}