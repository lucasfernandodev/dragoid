import { logger } from "../../utils/logger.ts";
import { isValidUrl } from "../../utils/validate.ts";
import { GenerateOutputFile } from "./generate-output-file.ts";

interface Data {
  mode?: 'novel' | 'chapter',
  url?: string;
  listOutputFormats?: boolean;
  outputFormat?: string;
  listCrawlers?: boolean;
}

export const validateInput = ({
  mode,
  url,
  outputFormat,
  listCrawlers = false,
  listOutputFormats = false
}: Data) => {

  const generateOutputFile = new GenerateOutputFile()
  

  // Download
  if (!listCrawlers  && !listOutputFormats) {

    if (!mode) {
      logger.error('Mode is required', 1, true)
    }

    if (!url) {
      logger.error('Url is required', 1, true)
    }

    if (!outputFormat) {
      logger.error('output-format is required', 1, true)
    }

    if (mode !== 'novel' && mode !== 'chapter') {
      logger.error('Mode value is invalid', 1, true)
    }

    if (url && !isValidUrl(url)) {
      logger.error('Url value is invalid', 1, true)
    }

    if (mode && outputFormat) {
      const formatts = generateOutputFile.getSupportedFormats()

      if (mode === 'novel') {
        if (!formatts.novel.find(type => type === outputFormat)) {
          logger.error('Output format invalid', 1, true)
        }
      }

      if (mode === 'chapter') {
        if (!formatts.chapter.find(type => type === outputFormat)) {
          logger.error('Output format invalid', 1, true)
        }
      }
    }
  }

  // Information
  if (listCrawlers || listOutputFormats) {
    if (url || outputFormat) {
      logger.error('Args invalid', 1, true)
    }

    if(listCrawlers && listOutputFormats){
      logger.error('Args invalid', 1, true)
    }
  }

  return true;
}