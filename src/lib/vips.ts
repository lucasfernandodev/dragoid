import path from 'node:path'
import Vips from 'wasm-vips'
import { ApplicationError } from '../errors/application-error.ts'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const entry = require.resolve('wasm-vips')
const libDir = path.dirname(entry)

export const vipsInstance = async () => {
  try {
    const vips = await Vips({
      locateFile: (filename) => path.join(libDir, filename),
    })
    return vips
  } catch (error) {
    throw new ApplicationError('Failed to load image processor', error)
  }
}
