import { ValidationError } from './../../errors/validation-error.ts';
import type { TypeCommandDownloadArgs } from '../../types/command-download-args.ts';
import { ZodIssueCode, z } from 'zod';
import { outputSupported } from '../../core/configurations.ts';
interface Args extends Partial<TypeCommandDownloadArgs> {
  $0: string;
  _: any
}

const validateDonwloadCommandFlags = z.object({
  mode: z.enum(['novel', 'chapter'], {
    message: `Invalid value for option '--mode'. Supported values are 'chapter' or 'novel'`
  }),
  url: z.string().url({ message: "Invalid value for option '--url'" }),
  outputFormat: z.string({
    message: "the --output-format option must not be left empty"
  }),
  skip: z.coerce.number({
    message: "Invalid value for option '--skip'. Option must be a number"
  }).min(0, {
    message: "Invalid value for option '--skip'. Option must be 0 or greater"
  }).optional(),
  limit: z.coerce.number({
    message: "Invalid value for option '--limit'. Option must be a number"
  }).min(1, {
    message: "Invalid value for option '--limit'. Option must be 1 or greater"
  }).optional(),
}).superRefine((data, ctx) => { 
  const allowed = outputSupported[data.mode];
  if (!allowed.includes(data.outputFormat as any)) {
    ctx.addIssue({
      code: ZodIssueCode.custom,
      path: ["outputFormat"],
      message: `Invalid value for option '--output-format' when '--mode=${data.mode}'. Supported values are ${allowed.join(", ")}`,
    });
  }
});

 




export const validateInput = (data: Args) => {

  const options = {
    mode: data['mode'],
    url: data['url'],
    outputFormat: data['output-format'],
    listOutputFormats: data['list-output-formats'],
    listCrawlers: data['list-crawlers'],
    limit: data['limit'],
    skip: data['skip'],
  }

  const optionsKeys = Object.keys(options).filter(key => typeof options[key] !== 'undefined');

  // Check if there are conflicting options
  if (options.listOutputFormats) {
    if (optionsKeys.length !== 1) {
      throw new ValidationError(
        `Argument conflict, '--list-output-formats' option cannot be used together with other flags`
      )
    }
    return true;
  }

  if (options.listCrawlers) {
    if (optionsKeys.length !== 1) {
      throw new ValidationError(
        `Argument conflict, '--list-crawlers' option cannot be used together with other flags`
      )
    }
    return true;
  }



  // Validate download props
  const missingDownloadFlags: string[] = []
  if (!options.mode) {
    missingDownloadFlags.push("'--mode'")
  }

  if (!options.url) {
    missingDownloadFlags.push("'--url'")
  }

  if (!options.outputFormat) {
    missingDownloadFlags.push("'--output-format'")
  }

  if (missingDownloadFlags.length > 0) {
    throw new ValidationError(
      `Missing required option(s): ${missingDownloadFlags.join(", ")}`
    );
  }

  validateDonwloadCommandFlags.parse({
    mode: options.mode,
    url: options.url,
    outputFormat: options.outputFormat,
    skip: options.skip,
    limit: options.limit,
  })
}