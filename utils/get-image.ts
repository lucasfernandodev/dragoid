import Vips from 'wasm-vips';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Baixa uma imagem de uma URL, processa-a para reduzir seu tamanho, redimensiona se necessário
 * e converte para base64.
 * @param imageUrl URL da imagem a ser baixada.
 * @param maxSizeInBytes Tamanho máximo permitido em bytes (padrão: 1MB).
 * @returns String com a imagem em base64.
 */
export const downloadAndProcessImage = async (
  imageUrl: string
): Promise<string> => {


  // Baixa a imagem
  const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

  const vips = await Vips({
    locateFile: (filename) => {
      return path.join(__dirname, `../node_modules/wasm-vips/lib/${filename}`)
    }
  });


  const image = vips.Image.thumbnailBuffer(response.data, 300, {
    height: 380,
    no_rotate: true,
    crop: vips.Interesting.attention
  })

  const base64Image = Buffer.from(image.jpegsaveBuffer({ Q: 7 })).toString('base64');

  return base64Image;
}
