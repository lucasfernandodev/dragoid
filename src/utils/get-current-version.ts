import path from "path";
import { fileURLToPath } from "url";
import { readFile } from "./file.ts";
import { isBuild } from "../core/configurations.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getCurrentVersion = async () => {
  const realPath = isBuild ? '../package.json' : '../../package.json'

  const packageJSONPath = path.join(__dirname, realPath);
  const packageJSON = await readFile<{ version: string }>(packageJSONPath);
  const version = packageJSON?.version;
  return version
}