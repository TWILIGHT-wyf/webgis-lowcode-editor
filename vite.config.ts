import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // ECharts 相关库单独打包
            if (id.includes('echarts') || id.includes('zrender') || id.includes('vue-echarts')) {
              return 'echarts-vendor'
            }
            // Leaflet 地图库单独打包
            if (id.includes('leaflet')) {
              return 'leaflet-vendor'
            }
            // Element Plus UI 库单独打包
            if (id.includes('element-plus') || id.includes('@element-plus')) {
              return 'element-plus-vendor'
            }
            // 其他第三方库归入 vendor
            return 'vendor'
          }
        },
      },
    },
  },
})
