import type { OutputSupportedFormats } from "../commands/download/generate-output-file";

export type CLIOptionsDownloadType = {
  mode: 'novel' | 'chapter';
  url: string;
  'list-crawlers': boolean;
  'list-output-formats': boolean;
  'output-format': OutputSupportedFormats;
}