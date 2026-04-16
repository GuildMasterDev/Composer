import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { readFileSync } from 'fs'

const pkg = JSON.parse(readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'))

// Base path for GitHub Pages project site: https://<owner>.github.io/Composer/
const BASE_PATH = process.env.COMPOSER_WEB_BASE ?? '/Composer/'

export default defineConfig({
  plugins: [react()],
  base: BASE_PATH,
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __WEB_MODE__: 'true'
  },
  build: {
    outDir: 'dist-web',
    emptyOutDir: true,
    sourcemap: false
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@renderer': path.resolve(__dirname, './src/renderer'),
      '@shared': path.resolve(__dirname, './src/shared')
    }
  },
  server: {
    port: 5174,
    strictPort: true
  },
  preview: {
    port: 4173,
    strictPort: true
  }
})
