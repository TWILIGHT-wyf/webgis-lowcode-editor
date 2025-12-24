import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

// Merge Vite config with Vitest-specific test options
export default mergeConfig(
  viteConfig,
  defineConfig({
    resolve: {
      alias: {
        // 确保 @twi1i9ht/visual-lib 解析到本地 packages 目录
        '@twi1i9ht/visual-lib': path.resolve(__dirname, 'packages/visual-lib/index.ts'),
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      // 全局 setup 文件：在此处注册我们创建的 mocks（Leaflet / ECharts / axios）
      setupFiles: ['./tests/setupTests.ts'],
      // 包含的测试文件夹（组件/单元/集成）
      include: [
        'tests/unit/**/*.spec.ts',
        'tests/components/**/*.spec.ts',
        'tests/integration/**/*.spec.ts',
      ],
      // exclude e2e from unit/component runs
      exclude: [...configDefaults.exclude, 'tests/e2e/**', 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      // CSS 处理配置
      css: {
        modules: {
          classNameStrategy: 'non-scoped',
        },
      },
      // 服务器配置
      server: {
        deps: {
          inline: ['element-plus'],
        },
      },
    },
  }),
)
