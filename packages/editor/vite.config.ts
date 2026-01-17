import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@lowcode/editor': fileURLToPath(new URL('./src', import.meta.url)),
      '@lowcode/core': fileURLToPath(new URL('../core/src', import.meta.url)),
      '@lowcode/ui': fileURLToPath(new URL('../ui', import.meta.url)),
      '@lowcode/materials': fileURLToPath(new URL('../materials/src', import.meta.url)),
      '@lowcode/renderer': fileURLToPath(new URL('../renderer/src', import.meta.url)),
      '@lowcode/generator': fileURLToPath(new URL('../generator/src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
  },
})
