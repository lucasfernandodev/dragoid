export type TypeCommandDownloadArgs = {
  mode: 'novel' | 'chapter';
  url: string;
  'list-crawlers': boolean;
  'list-output-formats': boolean;
  'output-format': string;
}