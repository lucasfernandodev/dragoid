import esbuild from 'esbuild';  
import { getCurrentVersion } from './src/utils/helper.ts';

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
    'process.env.VERSION_PLACEHOLDER': `'${await getCurrentVersion()}'`,
    '__IS_BUILD__': 'true'
  },
  external: [
    'tslib',
    'typescript',
    'puppeteer',
    'puppeteer-extra',
    'puppeteer-extra-plugin-stealth'
  ]
}).catch(() => process.exit(1));