import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import viteCompression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    // Element Plus 按需自动导入
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: ['vue', 'vue-router', 'pinia'],
      dts: 'src/auto-imports.d.ts',
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'src/components.d.ts',
    }),
    // Gzip 压缩 - 解决「启用文本压缩」问题
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240, // 大于 10KB 的文件才压缩
      algorithm: 'gzip',
      ext: '.gz',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@twi1i9ht/visual-lib': fileURLToPath(
        new URL('./packages/visual-lib/index.ts', import.meta.url),
      ),
    },
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
  server: {
    host: 'localhost',
    port: 8080,
    strictPort: false, // 如果端口被占用，尝试下一个可用端口
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
  // CSS 优化配置
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        // 
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 压缩配置
    minify: 'esbuild',
    // 启用 sourcemap 以便调试（生产可关闭）
    sourcemap: false,
    // 目标浏览器，使用现代语法减少代码体积
    target: 'es2020',
    rollupOptions: {
      output: {
        // 优化分包策略，进一步细分大包
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // ECharts 核心与渲染器分离
            if (id.includes('echarts/core') || id.includes('zrender')) {
              return 'echarts-core'
            }
            // ECharts 图表类型单独打包（按需加载）
            if (id.includes('echarts/charts') || id.includes('echarts/components')) {
              return 'echarts-charts'
            }
            // vue-echarts 单独打包
            if (id.includes('vue-echarts')) {
              return 'vue-echarts'
            }
            // 保留 echarts 主包的兜底
            if (id.includes('echarts')) {
              return 'echarts-vendor'
            }
            // Leaflet 地图库单独打包
            if (id.includes('leaflet')) {
              return 'leaflet-vendor'
            }
            // Element Plus 组件按类别分包
            if (id.includes('element-plus')) {
              if (id.includes('es/components')) {
                return 'el-components'
              }
              return 'el-core'
            }
            if (id.includes('@element-plus/icons')) {
              return 'el-icons'
            }
            // Vue 核心库单独打包
            if (id.includes('vue') || id.includes('@vue')) {
              return 'vue-vendor'
            }
            // 工具库单独打包
            if (id.includes('lodash') || id.includes('axios')) {
              return 'utils-vendor'
            }
            // 其他第三方库归入 vendor
            return 'vendor'
          }
        },
        // 优化文件命名，利于浏览器缓存
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || ''
          if (name.endsWith('.css')) {
            return 'assets/css/[name]-[hash][extname]'
          }
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(name)) {
            return 'assets/images/[name]-[hash][extname]'
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(name)) {
            return 'assets/fonts/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        },
      },
    },
  },
  // 优化依赖预构建
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'axios', 'lodash-es'],
    exclude: ['@twi1i9ht/visual-lib'],
  },
})
