import fs from 'node:fs/promises';
import { logger } from './logger.ts';

export const writeFile = async (filename: string, type: string, data: string) => {
  try {
    await fs.writeFile(`${filename}.${type}`, data);
  } catch (error) {
    logger.error(`Error writing file: ${error}`, 2, true);
  }
}

export const readFile = async <T>(filepath: string) => {
  try {
    const data = await fs.readFile(filepath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (error) {
    logger.error(`Error writing file: ${error}`, 2, true);
    return null
  }
}