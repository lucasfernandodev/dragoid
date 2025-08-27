import { resolve } from 'node:path'
import viteFastify from '@fastify/vite/plugin'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  root: resolve(import.meta.dirname, 'src', 'client'),
  build: {
    emptyOutDir: true,
    outDir: resolve(import.meta.dirname, 'bin', 'client', 'dist'),
  },
  plugins: [
    viteFastify({
      spa: true,
    }),
    viteReact({ jsxRuntime: 'automatic' }),
  ],
  define: {
    'import.meta.env.FAVICON': JSON.stringify(
      mode !== 'development' ? '/img/icon.svg' : '/img/icon-dev.svg'
    ),
  },
}))