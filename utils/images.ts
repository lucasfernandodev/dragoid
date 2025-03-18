import { logger } from './logger.ts';
import Vips from 'wasm-vips';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const downloadImage = async (url: string): Promise<Buffer | null> => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    
    if (response?.data && Buffer.isBuffer(response.data)) {
      return response?.data;
    }

    logger.error('Unable to download thumbnail', 1);

    return null;
  } catch (error) {
    logger.error('Unable to download thumbnail', 1);
    return null;
  }
}


export const processImageToBase64 = async (image: Buffer): Promise<string|null> => {
  try {
    const vips = await Vips({
      locateFile: (filename) => {
        return path.join(__dirname, `../node_modules/wasm-vips/lib/${filename}`)
      }
    });

    const newImage = vips.Image.thumbnailBuffer(image, 300, {
      height: 380,
      no_rotate: true,
      crop: vips.Interesting.attention
    })

    const blob = newImage.jpegsaveBuffer({ Q: 7 })
  
    const base64Image = Buffer.from(blob).toString('base64');
    return base64Image;

  } catch (error) {
    logger.error('It is not possible to process the image', 1);
    return null;
  }
}