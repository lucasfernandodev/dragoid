import esbuild from 'esbuild'; 
import path from 'path';
import { fileURLToPath } from 'url';
import { readFile } from './src/utils/file.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJSONPath = path.join(__dirname, `./package.json`);
const packageJSON = await readFile<{version: string}>(packageJSONPath);
const version = packageJSON?.version; 

esbuild.build({
  entryPoints: ['./src/dragoid.ts'],
  bundle: true,
  platform: 'node',
  target: 'node22.13.1',
  outfile: './bin/dragoid',
  format: 'esm',
  banner: {
    js: 'import { createRequire as topLevelCreateRequire } from "module";\n const require = topLevelCreateRequire(import.meta.url);'
  },
  define: {
    'process.env.VERSION_PLACEHOLDER': `'${version}'`
  },
  external: [
    'tslib',
    'typescript',
    'puppeteer',
    'puppeteer-extra',
    'puppeteer-extra-plugin-stealth'
  ]
}).catch(() => process.exit(1));