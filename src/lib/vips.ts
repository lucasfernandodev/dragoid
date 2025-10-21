import path from 'path'
import { fileURLToPath } from 'url'
import Vips from 'wasm-vips'
import { ApplicationError } from '../errors/application-error.ts'
import { isBuild } from '../core/configurations.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const vipsInstance = async () => {
  try {
    const vips = await Vips({
      locateFile: (filename) => {
        if (isBuild) {
          return path.join(
            __dirname,
            `../node_modules/wasm-vips/lib/${filename}`
          )
        }

        return path.join(
          __dirname,
          `../../node_modules/wasm-vips/lib/${filename}`
        )
      },
    })
    return vips
  } catch (error) {
    throw new ApplicationError('Failed to load image processor', error)
  }
}
