import axios from "axios";
import { z } from "zod";
import { logger } from "../utils/logger.ts";
import { ApplicationError } from "../errors/application-error.ts";
import { vipsInstance } from "../lib/vips.ts";
 

const validateUrl = z.string().url();
const validateConfig = z.object({
  quality: z.number().min(1).max(8)
}).strict()

export class ThumbnailProcessor {
  private url = '';
  private quality = 8;

  constructor(url: string, config = { quality: 8 }) {
    const isSafeUrl = validateUrl.safeParse(url);
    const isSafeConfig = validateConfig.safeParse(config)
    if (!isSafeUrl.success) {
      throw new ApplicationError(
        'The retrieved thumbnail url is invalid', isSafeUrl.error
      )
    }

    if (!isSafeConfig.success) {
      throw new ApplicationError(
        'Configuration props is invalid', isSafeConfig.error
      )
    }

    this.url = url;
    this.quality = isSafeConfig?.data?.quality
  }

  private download = async (url: string): Promise<Buffer | null> => {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer'
      })

      if (response?.data && Buffer.isBuffer(response.data)) {
        return response.data;
      }
    } catch (error) {
      throw new ApplicationError('Thumbnail download failed', error)
    }

    return null;
  }

  private toBase64 = async (image: Buffer) => {
    const vips = await vipsInstance()
    const newImage = vips.Image.thumbnailBuffer(image, 300, {
      height: 380,
      no_rotate: true,
      crop: vips.Interesting.attention
    })
    const blob = newImage.jpegsaveBuffer({ Q: this.quality })
    const base64Image = Buffer.from(blob).toString('base64');
    return base64Image;
  }

  public execute = async () => {
    const imageBuffer = await this.download(this.url);
    if (!imageBuffer) {
      logger.warning('Novel thumbnail failed');
      return '<image-url>';
    }

    const imageBase64 = await this.toBase64(imageBuffer);
    return imageBase64;
  }
}