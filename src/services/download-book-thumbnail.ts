import { z } from 'zod'
import { ApplicationError } from '../errors/application-error.ts'
import axios from 'axios'
import { vipsInstance } from '../lib/vips.ts'
import { urlSchema } from '../core/schemas/url.ts'

interface Options {
  quality: number
}

const optionsSchema = z
  .object({
    quality: z.number().min(1).max(9),
  })
  .strict()

export class DownloadBookThumbnail {
  private quality = 9
  private dimensions = {
    width: 300,
    height: 380,
  }

  constructor(options: Options = { quality: 9 }) {
    const { success, data, error } = optionsSchema.safeParse(options)
    if (!success) {
      throw new ApplicationError('Download thumbnail options invalid', error)
    }

    this.quality = data.quality
  }

  private getValidUrl = (url: string) => {
    const { success, error, data } = urlSchema.safeParse(url)
    if (!success) {
      throw new ApplicationError('Retrieved thumbnail url is invalid', error)
    }

    return data
  }

  private downloadImage = async (url: string) => {
    try {
      const res = await axios.get(this.getValidUrl(url), {
        responseType: 'arraybuffer',
      })

      if (!res?.data) {
        throw new ApplicationError(
          'Thumbnail download failed: Response data is empty'
        )
      }

      if (!Buffer.isBuffer(res.data)) {
        throw new ApplicationError(
          'Thumbnail download failed: Response content is not a valid Buffer'
        )
      }

      return res.data
    } catch (error) {
      throw new ApplicationError('Thumbnail download failed', error)
    }
  }

  private convertBufferToBase64 = async (imageBuffer: Buffer) => {
    const vips = await vipsInstance()
    const vipsImage = vips.Image.thumbnailBuffer(
      imageBuffer,
      this.dimensions.width,
      {
        height: this.dimensions.height,
        no_rotate: true,
        crop: vips.Interesting.attention,
      }
    )

    const blob = vipsImage.jpegsaveBuffer({ Q: this.quality })
    const base64Image = Buffer.from(blob).toString('base64')
    return base64Image
  }

  public execute = async (url: string): Promise<string> => {
    const imageBuffer = await this.downloadImage(url)
    const base64 = await this.convertBufferToBase64(imageBuffer)
    return base64
  }
}
