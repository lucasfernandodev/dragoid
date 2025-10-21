import { lstatSync } from 'node:fs'
import { resolveUserPath } from './path.ts'
/**
 * @param {string} path - The path.
 * @returns {boolean} Whether path is a directory, otherwise always false.
 */
export const isDir = (path: string): boolean => {
  try {
    const stat = lstatSync(resolveUserPath(path))
    return stat.isDirectory()
  } catch (_) {
    return false
  }
}
