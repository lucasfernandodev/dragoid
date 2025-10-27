import fs from 'node:fs/promises'
import { ApplicationError } from '../errors/application-error.ts'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { resolveUserPath } from './io.ts'

export const writeFile = async (
  filename: string,
  type: string,
  data: string
) => {
  try {
    await fs.writeFile(`${filename}.${type}`, data)
  } catch (error) {
    throw new ApplicationError(
      `Unable to create file. Check path and permissions.`,
      error
    )
  }
}

export const readFile = async <T>(filepath: string) => {
  try {
    const data = await fs.readFile(resolveUserPath(filepath), 'utf-8')
    return JSON.parse(data) as T
  } catch (error) {
    throw new ApplicationError(
      `Unable to read file. Check existence and permissions.`,
      error
    )
  }
}

/**
 * Receives a Base64 string (only the payload, without the data URL prefix) and returns
 * a file:// URL pointing to a temporary file that was just created.
 */
export async function base64ToFileUrl(
  base64: string,
  ext: string = 'jpeg'
): Promise<string> {
  const buffer = Buffer.from(base64, 'base64')
  const filename = `img-${Date.now()}.${ext}`
  const filepath = join(tmpdir(), filename)
  await fs.writeFile(filepath, buffer)
  return filepath
}
