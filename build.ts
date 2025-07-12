import esbuild from 'esbuild';
import { getCurrentVersion } from './src/utils/get-current-version.ts';

esbuild.build({
  entryPoints: ['./src/dragoid.ts'],
  bundle: true,
  platform: 'node',
  target: 'node22.17.0',
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
    'puppeteer-extra-plugin-stealth',
    'eslint',
    'globals',
    'husky',
    'typescript-eslint'
  ]
}).catch(() => process.exit(1));