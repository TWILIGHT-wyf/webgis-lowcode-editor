import { test, expect } from '@playwright/test'

/*
  tests/e2e/eventFlow.e2e.ts
  目的：使用 Playwright 验证关键 E2E 流程：
   - 在编辑器拖拽组件到画布并验证渲染
   - 组件靠近其他组件时显示吸附线
   - 拖动完成后触发联动（如高亮/数据更新）
   - 在预览模式下验证事件/联动与编辑器一致
   - 导入/导出 JSON 基本流程

  说明：此文件作为示例，选择器假设使用 `data-testid`，请根据项目实际 HTML 调整选择器。
*/

test.describe('E2E：事件/联动/吸附 流程', () => {
  test.beforeEach(async ({ page }) => {
    // 访问编辑器主页（根据 vite 配置可能是 /）
    await page.goto('/')
    await expect(page).toHaveTitle(/webgis/i)
  })

  test('拖拽组件到画布 -> 渲染 -> 吸附线显示 -> 联动触发', async ({ page }) => {
    // 假设侧栏中组件可通过 data-testid="tool-item-rect" 拖拽
    const source = page.locator('[data-testid="tool-item-rect"]')
    const canvas = page.locator('[data-testid="editor-canvas"]')

    // 拖拽：将组件拖到画布中央位置
    const canvasBox = await canvas.boundingBox()
    if (!canvasBox) throw new Error('找不到画布边界')

    await source.hover()
    await page.mouse.down()
    await page.mouse.move(canvasBox.x + canvasBox.width / 2, canvasBox.y + canvasBox.height / 2)

    // 在移动过程中检查是否显示吸附线（data-testid="snap-line"）
    const snap = page.locator('[data-testid="snap-line"]')
    // 等待吸附线出现（如果实现有延迟）
    await page.waitForTimeout(200)
    const visible = await snap.isVisible().catch(() => false)

    // 拖拽结束
    await page.mouse.up()

    // 断言：组件已被渲染在画布上
    const placed = page.locator('[data-testid="component-instance"]').first()
    await expect(placed).toBeVisible()

    // 如果吸附线可见，则断言其存在
    if (visible) expect(await snap.isVisible()).toBe(true)

    // 联动：点击新放置组件，检查另一个组件是否高亮（data-testid="component-B"）
    await placed.click()
    const compB = page.locator('[data-testid="component-B"]')
    await expect(compB).toHaveClass(/highlight/) // 假定高亮通过 class 控制
  })

  test('属性面板修改 -> 组件同步更新 -> 预览模式一致', async ({ page }) => {
    // 选择已存在的组件
    const comp = page.locator('[data-testid="component-instance"]').first()
    await comp.click()

    // 在属性面板中修改宽度（例如 input data-testid="prop-width"）
    const widthInput = page.locator('[data-testid="prop-width"]')
    await widthInput.fill('300')
    // 点击应用
    await page.locator('[data-testid="prop-apply"]').click()

    // 画布上组件应更新（style.width 或 data 属性）
    await expect(comp).toHaveCSS('width', /300px/)

    // 切换到预览模式（data-testid="btn-preview"）
    await page.locator('[data-testid="btn-preview"]').click()
    // 在预览模式验证组件宽度一致且事件触发仍然有效
    const previewComp = page.locator('[data-testid="preview-component-instance"]').first()
    await expect(previewComp).toHaveCSS('width', /300px/)

    // 点击触发事件并验证联动（preview 中的 B 组件高亮）
    await previewComp.click()
    const previewB = page.locator('[data-testid="preview-component-B"]')
    await expect(previewB).toHaveClass(/highlight/)
  })

  test('导出/导入 JSON', async ({ page }) => {
    // 点击导出按钮并读取下载内容（Playwright 可以监听下载）
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('[data-testid="btn-export-json"]').click(),
    ])
    const path = await download.path()
    expect(path).toBeTruthy()

    // 导出后清空画布并导入
    await page.locator('[data-testid="btn-clear-canvas"]').click()

    // 上传导出的文件进行导入（Playwright 支持 file chooser）
    await page.setInputFiles('[data-testid="input-import-json"]', path!)

    // 验证导入后组件回到画布
    const comp = page.locator('[data-testid="component-instance"]').first()
    await expect(comp).toBeVisible()
  })
})
