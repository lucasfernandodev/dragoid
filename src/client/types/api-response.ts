export interface Response<T> {
  success: boolean;
  data: T;
  error?: {
    message: string;
    title?: string;
  }
}