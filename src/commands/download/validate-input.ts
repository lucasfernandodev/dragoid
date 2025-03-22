import { ValidationError } from './../../errors/validation-error.ts';
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
  if (!listCrawlers && !listOutputFormats) {

    if (!mode) {
      throw new ValidationError('Option --mode=<novel|chapter> is required')
    }

    if (mode !== 'novel' && mode !== 'chapter') {
      throw new ValidationError(`Option "--mode=${mode}" is invalid. Use --mode=<chapter|novel>`)
    }

    if (!url) {
      throw new ValidationError('Option --url=<URL> is required')
    }

    if (url && !isValidUrl(url)) {
      throw new ValidationError('Url value is invalid')
    }

    if (!outputFormat) {
      throw new ValidationError('Option --output-format=<JSON|EPUB|HTML> is required')
    }


    if (mode && outputFormat) {
      const formatts = generateOutputFile.getSupportedFormats()

      if (mode === 'novel') {
        if (!formatts.novel.find(type => type === outputFormat)) {
          throw new ValidationError('Option output-format invalid')
        }
      }

      if (mode === 'chapter') {
        if (!formatts.chapter.find(type => type === outputFormat)) {
          throw new ValidationError('Option output-format invalid')
        }
      }
    }
  }

  // Information
  if (listCrawlers || listOutputFormats) {
    if (url || outputFormat) {
      throw new ValidationError('Args invalid')
    }

    if (listCrawlers && listOutputFormats) {
      throw new ValidationError('Args invalid')
    }
  }

  return true;
}