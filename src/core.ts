import { ValidationError } from "./errors/validation-error.ts";
import { printChaptersDownloadProgress } from "./utils/logger.ts";

type callback<T> = (data: T, index: number) => void | Promise<void>
type options = {
  skip?: number;
  limit?: number;
}

export const processChaptersList = async <T>(data: T[], callback: callback<T>, opt: options) => {
  if (opt?.skip !== undefined && opt.skip < 0) {
    throw new ValidationError('The value for the --skip option must be 0 or greater.')
  }

  if (opt?.skip !== undefined && opt?.skip >= data.length) {
    throw new ValidationError(
      'The value for the --skip option cannot exceed the total number of available items.'
    )
  }

  if (opt?.limit !== undefined && opt.limit < 1) {
    throw new ValidationError('The value for the --limit option must be 1 or greater.')
  }

  if (opt?.limit !== undefined && opt.limit >= data.length) {
    throw new ValidationError(
      'The value for the --limit option cannot exceed the total number of available items.'
    )
  }

  const listSize = data.length;
  const start = opt?.skip || 0;
  const end = opt?.limit ? Math.min(start + opt.limit, listSize) : listSize;

  const sliceData = opt.limit ? data.slice(start, end) : data;
  let index = 0;
  for (const item of sliceData) {
    await callback(item, index);
    printChaptersDownloadProgress(index + 1, sliceData.length);
    index++
  }
}