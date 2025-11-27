/**
 * Playwright E2E 示例：编辑器关键路径（请在 CI 或本地先启动 dev server）
 * 注意：测试中使用的选择器依赖于项目内添加的 data-testid 属性，运行前请确认页面包含这些标识。
 */
import { test, expect } from '@playwright/test'

test.describe('编辑器 E2E 流程', () => {
  test('首页加载并能进入编辑器', async ({ page, baseURL }) => {
    await page.goto(baseURL || 'http://localhost:5173/')
    await expect(page).toHaveTitle(/WebGIS|编辑器/i)
    // 打开编辑器（如果首页有跳转按钮）
    // await page.click('[data-testid="open-editor"]');
    // 断言画布存在
    await expect(page.locator('[data-testid="canvas-board"]')).toBeVisible()
  })

  test('拖入组件并移动，验证吸附线出现', async ({ page }) => {
    // 假设侧边栏组件卡片有 data-testid="component-card-chart"
    const source = page.locator('[data-testid="component-card-chart"]')
    const canvas = page.locator('[data-testid="canvas-board"]')
    if ((await source.count()) === 0) {
      test.skip()
      return
    }
    const box = await canvas.boundingBox()
    const srcBox = await source.boundingBox()
    if (box && srcBox) {
      await page.mouse.move(srcBox.x + srcBox.width / 2, srcBox.y + srcBox.height / 2)
      await page.mouse.down()
      await page.mouse.move(box.x + 100, box.y + 100)
      await page.mouse.up()
      // 等待渲染并断言组件存在
      await expect(canvas.locator('[data-testid="component-instance"]').first()).toBeVisible()
      // 验证吸附辅助线（snap line）出现
      await expect(page.locator('[data-testid="snap-line"]')).toBeVisible()
    }
  })

  test('预览模式与导出 JSON', async ({ page }) => {
    // 点击预览按钮
    const preview = page.locator('[data-testid="preview-btn"]')
    if ((await preview.count()) === 0) {
      test.skip()
      return
    }
    await preview.click()
    await expect(page.locator('[data-testid="preview-root"]')).toBeVisible()
    // 导出 JSON
    const exportBtn = page.locator('[data-testid="export-json"]')
    if ((await exportBtn.count()) > 0) {
      await exportBtn.click()
      // 如果页面有下载提示或显示导出结果，断言该元素
      await expect(page.locator('[data-testid="export-result"]')).toBeVisible()
    }
  })
})
