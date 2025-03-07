import axios from 'axios';
import sharp from 'sharp';

/**
 * Baixa uma imagem de uma URL, processa-a para reduzir seu tamanho, redimensiona se necessário
 * e converte para base64.
 * @param imageUrl URL da imagem a ser baixada.
 * @param maxSizeInBytes Tamanho máximo permitido em bytes (padrão: 1MB).
 * @returns String com a imagem em base64.
 */
export async function downloadAndProcessImage(imageUrl: string, maxSizeInBytes: number = 1 * 1024 * 1024): Promise<string> {
  // Baixa a imagem
  const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
  const imageBuffer = Buffer.from(response.data);

  // Define parâmetros de qualidade e dimensões máximas
  let quality = 70; // Qualidade inicial para JPEG (ajustável)
  const maxWidth = 150*2;
  const maxHeight = 190*2;

  // Obtém metadados da imagem para verificar as dimensões
  const metadata = await sharp(imageBuffer).metadata();

  // Função auxiliar que cria o pipeline do sharp com redimensionamento (se necessário) e compressão
  const processImage = (quality: number): Promise<Buffer> => {
    let pipeline = sharp(imageBuffer);
    if ((metadata.width && metadata.width > maxWidth) || (metadata.height && metadata.height > maxHeight)) {
      pipeline = pipeline.resize({
        width: maxWidth,
        height: maxHeight,
        fit: 'inside'
      });
    }
    return pipeline.jpeg({ quality }).toBuffer();
  };

  // Processa a imagem com a qualidade inicial
  let processedBuffer = await processImage(quality);

  // Ajusta a qualidade até que o buffer fique abaixo do tamanho máximo
  while (processedBuffer.length > maxSizeInBytes && quality > 10) {
    quality -= 10;
    processedBuffer = await processImage(quality);
  }

  // Converte o buffer para string base64
  return processedBuffer.toString('base64');
}
