import { outputSupported } from "../../../core/configurations.ts";
import { logger } from "../../../utils/logger.ts";

export const listOuputFormats = () => {
  const formats = outputSupported;
  logger.info([
    'Supported output formats, organized by download type:',
    '\nNovel: ',
    formats.novel.map(type => `[🗸] ${type}`).join('\n'),
    '\nChapter: ',
    formats.chapter.map(type => `[🗸] ${type}`).join('\n')
  ].join('\n'))
  process.exit(0)
}