import { ValidationError } from './../../errors/validation-error.ts';
import { ZodIssueCode, z } from 'zod';
import { outputSupported } from '../../core/configurations.ts';
import {
  CMD_DOWNLOAD_PROXY_FLAGS,
  type DownloadOptionsMap,
  type DownloadArgs
} from './options.ts';
import { isDir } from '../../utils/isDir.ts';


const validateDownloadCommandFlags = z.object({
  mode: z.enum(['novel', 'chapter'], {
    message: `Invalid value for option '--${CMD_DOWNLOAD_PROXY_FLAGS.mode}'. Supported values are 'chapter' or 'novel'`
  }),
  url: z.string().url({ message: `Invalid value for option '--${CMD_DOWNLOAD_PROXY_FLAGS.url}'` }),
  outputFormat: z.string({
    message: `the --${CMD_DOWNLOAD_PROXY_FLAGS.outputFormat} option must not be left empty`
  }),
  skip: z.coerce.number({
    message: `Invalid value for option '--${CMD_DOWNLOAD_PROXY_FLAGS.skip}'. Option must be a number`
  }).min(0, {
    message: `Invalid value for option '--${CMD_DOWNLOAD_PROXY_FLAGS.skip}'. Option must be 0 or greater`
  }).optional(),
  limit: z.coerce.number({
    message: `Invalid value for option '--${CMD_DOWNLOAD_PROXY_FLAGS.limit}'. Option must be a number`
  }).min(1, {
    message: `Invalid value for option '--${CMD_DOWNLOAD_PROXY_FLAGS.limit}'. Option must be 1 or greater`
  }).optional(),
  path: z.string()
    .min(1, {
      message: `Invalid value for option '--${CMD_DOWNLOAD_PROXY_FLAGS.path}'. Option must not be left empty`
    }).refine(p => isDir(p), {
      message: `Invalid value for option '--${CMD_DOWNLOAD_PROXY_FLAGS.path}'. Provided path does not exist or is not a directory`
    }).optional(),
}).superRefine((data, ctx) => {
  const allowed = outputSupported[data.mode];
  if (!allowed.includes(data.outputFormat as never)) {
    ctx.addIssue({
      code: ZodIssueCode.custom,
      path: ["outputFormat"],
      message: `Invalid value for option '--${CMD_DOWNLOAD_PROXY_FLAGS.outputFormat}' when '--${CMD_DOWNLOAD_PROXY_FLAGS.mode}=${data.mode}'. Supported values are ${allowed.join(", ")}`,
    });
  }
});






export const validateInput = (data: Partial<DownloadArgs>) => {

  const options = {} as DownloadOptionsMap

  // Set only options allowed
  for (const [option, flag] of Object.entries(CMD_DOWNLOAD_PROXY_FLAGS)) {
    const value = data[flag]
    options[option as keyof DownloadOptionsMap] = value as never
  }


  const optionsKeys = Object.keys(options).filter(
    (key) => typeof options[key as keyof DownloadOptionsMap] !== 'undefined'
  );

  // Check if there are conflicting options
  if (options.listOutputFormats) {
    if (optionsKeys.length !== 1) {
      throw new ValidationError(
        `Argument conflict, '--${CMD_DOWNLOAD_PROXY_FLAGS.listOutputFormats}' option cannot be used together with other flags`
      )
    }
    return true;
  }

  if (options.listCrawlers) {
    if (optionsKeys.length !== 1) {
      throw new ValidationError(
        `Argument conflict, '--${CMD_DOWNLOAD_PROXY_FLAGS.listCrawlers}' option cannot be used together with other flags`
      )
    }
    return true;
  }



  // Validate download props
  const missingDownloadFlags: string[] = []
  if (!options.mode) {
    missingDownloadFlags.push(`'--${CMD_DOWNLOAD_PROXY_FLAGS.mode}'`)
  }

  if (!options.url) {
    missingDownloadFlags.push(`'--${CMD_DOWNLOAD_PROXY_FLAGS.url}'`)
  }

  if (!options.outputFormat) {
    missingDownloadFlags.push(`'--${CMD_DOWNLOAD_PROXY_FLAGS.outputFormat}'`)
  }

  if (missingDownloadFlags.length > 0) {
    throw new ValidationError(
      `Missing required option(s): ${missingDownloadFlags.join(", ")}`
    );
  }


  validateDownloadCommandFlags.parse({
    mode: options.mode,
    url: options.url,
    outputFormat: options.outputFormat,
    skip: options.skip,
    limit: options.limit,
    path: options.path
  })
}