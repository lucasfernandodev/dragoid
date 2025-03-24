import { ValidationError } from './../../errors/validation-error.ts';
import { isValidUrl } from "../../utils/validate.ts";
import { GenerateOutputFile } from "./generate-output-file.ts";
import { isNumberValid } from '../../utils/helper.ts';
import type { TypeCommandDownloadArgs } from '../../types/command-download-args.ts';

interface Args extends Partial<TypeCommandDownloadArgs> {
  $0: string;
  _: any
}



export const validateInput = (data: Args) => {

  const listOutputFormats = data['list-output-formats'];
  const listCrawlers = data['list-crawlers'];
  const outputFormat = data['output-format'];

  const { mode, url } = data;

  const keys = Object.keys(data).filter(key => key !== "_" && key !== "$0");

  if (keys.length === 0) {
    throw new ValidationError(
      `Download options empty`
    )
  }

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


    if (typeof data?.limit !== 'undefined' && !isNumberValid(data.limit)) {
      throw new ValidationError(
        'The value provided for the --limit option must be a valid number'
      )
    }

    if (typeof data?.skip !== 'undefined' && !isNumberValid(data.skip)) {
      throw new ValidationError(
        'The value provided for the --skip option must be a valid number'
      )
    }


    if (typeof data?.limit !== 'undefined' && isNumberValid(data.limit)) {
      if (data.limit <= 0) {
        throw new ValidationError(
          ' The value for the --limit option must be greater than 0'
        )
      }
    }

    if (typeof data?.skip !== 'undefined'&& isNumberValid(data.skip)) {
      if (data.skip < 0) {
        throw new ValidationError(
          'The value for the --skip option must be 0 or greater.'
        )
      }
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