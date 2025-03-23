import fs from 'node:fs/promises';
import { ApplicationError } from '../errors/application-error.ts';

export const writeFile = async (filename: string, type: string, data: string) => {
  try {
    await fs.writeFile(`${filename}.${type}`, data);
  } catch (error) {
    throw new ApplicationError(`Unable to create file. Check path and permissions.`, error);
  }
}

export const readFile = async <T>(filepath: string) => {
  try {
    const data = await fs.readFile(filepath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (error) {
    throw new ApplicationError(`Unable to read file. Check existence and permissions.`, error);
    return null
  }
}
 

export async function fileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
}
