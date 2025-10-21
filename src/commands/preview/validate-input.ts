import { normalize } from 'path'
import { ValidationError } from '../../errors/validation-error.ts'
import {
  CMD_PREVIEW_PROXY_FLAGS,
  type PreviewArgs,
  type PreviewOptionsMapped,
} from './options.ts'
import { existsSync, statSync } from 'fs'

export const validatePreviewInput = (data: Partial<PreviewArgs>) => {
  const options = {} as PreviewOptionsMapped

  // Set only options allowed
  for (const [option, flag] of Object.entries(CMD_PREVIEW_PROXY_FLAGS)) {
    const value = data[flag]
    options[option as keyof PreviewOptionsMapped] = value as never
  }

  if (!options?.file) {
    throw new ValidationError(
      `Missing required argument '--${CMD_PREVIEW_PROXY_FLAGS.file}'. Please provide the path to a JSON file.`
    )
  }

  if (
    !options.file ||
    typeof options.file !== 'string' ||
    options.file.trim() === ''
  ) {
    throw new ValidationError(`Invalid path provided.`)
  }

  if (options.file.length > 255) {
    throw new ValidationError('Path too long')
  }

  if (!options.file.endsWith('.json')) {
    throw new ValidationError('Expected a .json file')
  }

  const safePath = normalize(options.file)

  if (!existsSync(safePath)) {
    throw new ValidationError(`File path does not exist`)
  }

  const stats = statSync(safePath)
  if (!stats.isFile()) {
    throw new ValidationError(`Expected a file, but received: ${safePath}`)
  }

  if (typeof options?.public !== 'undefined') {
    if (options.public !== true && options.public !== false) {
      throw new ValidationError(
        `Invalid argument: --${CMD_PREVIEW_PROXY_FLAGS.public} only accepts boolean values (true or false).`
      )
    }
  }

  if (options.port) {
    if (
      typeof options.port === 'string' &&
      (options.port as string).trim() === ''
    ) {
      throw new ValidationError('Port must not be empty.')
    }

    const port =
      typeof options.port === 'number' ? options.port : Number(options.port)

    if (Number.isNaN(port)) {
      throw new ValidationError('Port must be a number.')
    }

    if (!Number.isInteger(port)) {
      throw new Error('Port must be an integer.')
    }

    if (port < 2048 || port > 65535) {
      throw new Error('Port must be between 2048 and 65535.')
    }
  }

  return true
}
