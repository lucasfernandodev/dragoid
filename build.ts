import esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['./dragoid.ts'],
  bundle: true,
  platform: 'node',
  target: 'node22.13.1',
  outfile: './bin/dragoid',
  format: 'esm',
  banner: {
    js: 'import { createRequire as topLevelCreateRequire } from "module";\n const require = topLevelCreateRequire(import.meta.url);'
  },
  external: [
    'tslib',
    'typescript',
    'puppeteer',
    'puppeteer-extra',
    'puppeteer-extra-plugin-stealth'
  ]
}).catch(() => process.exit(1));