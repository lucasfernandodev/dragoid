import path from "path";
import { fileURLToPath } from "url";
import { readFile } from "./file.ts";
import { isBuild } from "../core/configurations.ts";

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