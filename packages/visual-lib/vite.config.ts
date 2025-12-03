import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    // 自动生成 .d.ts 类型文件，这样主项目引用时才有代码提示
    dts({ rollupTypes: true }),
  ],
  build: {
    lib: {
      // 入口文件
      entry: resolve(__dirname, 'index.ts'),
      name: 'one-visual-lib',
      fileName: 'visual-lib',
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue', 'echarts', 'vue-echarts'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
          echarts: 'echarts',
          'vue-echarts': 'VueECharts',
        },
      },
    },
  },
})
