import { lstatSync } from 'node:fs'
import { readFile } from 'fs/promises'
import { homedir } from 'node:os'
import { isAbsolute, join, resolve } from 'node:path'

interface SafeReturnSuccess<T> {
  isSuccess: true
  data: T
  error?: {
    message: string
  }
}

interface SafeReturnError<T> {
  isSuccess: false
  error: {
    message: string
  }
  data?: T
}

const safeReadFile = async <T>(
  path: string,
  encoding?: BufferEncoding | null
): Promise<SafeReturnSuccess<T> | SafeReturnError<T>> => {
  try {
    const file = await readFile(path, !encoding ? {} : { encoding: encoding })
    return {
      isSuccess: true,
      data: file as T,
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      isSuccess: false,
      error: {
        message: error?.message,
      },
    }
  }
}

/**
 * @param {string} path - The path.
 * @returns {boolean} Whether path is a directory, otherwise always false.
 */
const existDirectory = (path: string): boolean => {
  try {
    const stat = lstatSync(resolveUserPath(path))
    return stat.isDirectory()
  } catch (_) {
    return false
  }
}

/**
 * Expands leading `~` to the user’s home directory,
 * makes the path absolute (relative to cwd if needed),
 * and normalizes it.
 */
export function resolveUserPath(input: string): string {
  let p = input

  // 1) Expand ~/ or ~
  if (p === '~') {
    p = homedir()
  } else if (p.startsWith('~/')) {
    p = join(homedir(), p.slice(2))
  }

  // 2) Make absolute (relative to cwd if not already)
  if (!isAbsolute(p)) {
    p = resolve(process.cwd(), p)
  }

  return p
}

export { safeReadFile, existDirectory }
