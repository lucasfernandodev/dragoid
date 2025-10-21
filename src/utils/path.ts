import { homedir } from 'node:os'
import { isAbsolute, join, resolve } from 'node:path'

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
