import { resolve } from 'node:path'
import viteFastify from '@fastify/vite/plugin'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => ({
  root: resolve(__dirname, 'src', 'client'),
  build: {
    emptyOutDir: true,
    outDir: resolve(__dirname, 'bin', 'client', 'dist'),
  },
  plugins: [
    viteFastify({
      spa: true,
      useRelativePaths: true
    }),
    viteReact({ jsxRuntime: 'automatic' }),
  ],
  define: {
    'import.meta.env.FAVICON': JSON.stringify(
      mode !== 'development' ? '/img/icon.svg' : '/img/icon-dev.svg'
    ),
  },
}))