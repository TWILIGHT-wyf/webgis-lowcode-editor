import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

// Merge Vite config with Vitest-specific test options
export default mergeConfig(
  viteConfig,
  defineConfig({
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
    },
  }),
)
