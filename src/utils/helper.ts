import path from "path";
import { fileURLToPath } from "url";
import { readFile } from "./file.ts";

declare const __IS_BUILD__: boolean;
export const isBuild = typeof __IS_BUILD__ !== 'undefined' ? __IS_BUILD__ : process.env.IS_BUILD === 'true';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getCurrentVersion = async () => {
  if(isBuild){
    const packageJSONPath = path.join(__dirname, `../package.json`);
    const packageJSON = await readFile<{ version: string }>(packageJSONPath);
    const version = packageJSON?.version;
    return version;
  }

  const packageJSONPath = path.join(__dirname, `../../package.json`);
  const packageJSON = await readFile<{ version: string }>(packageJSONPath);
  const version = packageJSON?.version;
  return version
}