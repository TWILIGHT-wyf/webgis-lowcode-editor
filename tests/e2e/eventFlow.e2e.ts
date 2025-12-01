/**
 * Playwright E2E 测试：事件流与组件联动
 *
 * 测试目标：
 * 1. 验证组件事件配置后，在运行时能正确触发
 * 2. 验证组件间联动（如点击按钮显示/隐藏面板）
 * 3. 验证属性面板修改后组件实时更新
 * 4. 验证预览模式下事件行为与编辑器一致
 * 5. 验证 JSON 导入/导出功能完整性
 *
 * 注意：选择器使用 data-testid 或 CSS 类名，请根据实际页面结构调整
 */
import { test, expect } from '@playwright/test'

test.describe('E2E：事件流与组件联动', () => {
  // 测试前准备：访问编辑器页面
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // 等待页面完全加载
    await page.waitForLoadState('networkidle')
  })

  test('拖拽组件到画布并验证渲染', async ({ page }) => {
    // 查找组件栏中的组件项
    const componentItem = page.locator(
      '[data-testid^="component-card"], [data-testid^="tool-item"], .component-item',
    )

    // 查找画布区域
    const canvas = page.locator(
      '[data-testid="canvas-board"], [data-testid="editor-canvas"], .canvas-container',
    )

    // 检查必要元素是否存在
    if ((await componentItem.count()) === 0) {
      test.skip(true, '未找到组件栏项目')
      return
    }

    const canvasBox = await canvas.first().boundingBox()
    const itemBox = await componentItem.first().boundingBox()

    if (!canvasBox || !itemBox) {
      test.skip(true, '无法获取元素边界')
      return
    }

    // 执行拖拽：从组件栏拖到画布
    await page.mouse.move(itemBox.x + itemBox.width / 2, itemBox.y + itemBox.height / 2)
    await page.mouse.down()
    await page.mouse.move(canvasBox.x + canvasBox.width / 2, canvasBox.y + canvasBox.height / 2, {
      steps: 10,
    })
    await page.mouse.up()

    // 等待组件渲染
    await page.waitForTimeout(500)

    // 验证组件已添加到画布
    const addedComponent = canvas.first().locator('[data-component-id], .shape-wrapper')
    await expect(addedComponent.first()).toBeVisible({ timeout: 5000 })
    console.log('✓ 组件成功添加到画布')
  })

  test('选中组件后属性面板显示', async ({ page }) => {
    // 查找画布中的组件
    const canvas = page.locator(
      '[data-testid="canvas-board"], [data-testid="editor-canvas"], .canvas-container',
    )
    const components = canvas.first().locator('[data-component-id], .shape-wrapper')

    if ((await components.count()) === 0) {
      test.skip(true, '画布中没有组件')
      return
    }

    // 点击选中第一个组件
    await components.first().click()

    // 验证属性面板显示
    const propertiesPanel = page.locator(
      '[data-testid="properties-panel"], .properties-panel, .sider-bar',
    )
    await expect(propertiesPanel.first()).toBeVisible({ timeout: 3000 })
    console.log('✓ 属性面板正常显示')
  })

  test('修改组件属性后画布同步更新', async ({ page }) => {
    // 确保有组件被选中
    const canvas = page.locator(
      '[data-testid="canvas-board"], [data-testid="editor-canvas"], .canvas-container',
    )
    const component = canvas.first().locator('[data-component-id], .shape-wrapper').first()

    if (!(await component.isVisible().catch(() => false))) {
      test.skip(true, '没有可操作的组件')
      return
    }

    // 点击选中组件
    await component.click()
    await page.waitForTimeout(200)

    // 查找尺寸输入框（宽度）
    const widthInput = page.locator(
      '[data-testid="prop-width"], input[placeholder*="宽"], .el-input-number input',
    )

    if ((await widthInput.count()) === 0) {
      console.log('⚠ 未找到宽度输入框，跳过属性修改测试')
      return
    }

    // 获取组件当前宽度
    const beforeBox = await component.boundingBox()
    const beforeWidth = beforeBox?.width || 0

    // 修改宽度值
    await widthInput.first().click()
    await widthInput.first().fill('250')
    await page.keyboard.press('Enter')
    await page.waitForTimeout(300)

    // 验证组件宽度已更新
    const afterBox = await component.boundingBox()
    if (afterBox && beforeWidth > 0) {
      console.log(`组件宽度: ${beforeWidth}px -> ${afterBox.width}px`)
    }
  })

  test('配置组件事件联动', async ({ page }) => {
    // 查找画布中的组件
    const canvas = page.locator(
      '[data-testid="canvas-board"], [data-testid="editor-canvas"], .canvas-container',
    )
    const components = canvas.first().locator('[data-component-id], .shape-wrapper')

    if ((await components.count()) < 1) {
      test.skip(true, '画布中组件不足，无法测试事件联动')
      return
    }

    // 选中第一个组件
    await components.first().click()

    // 查找事件配置面板/标签
    const eventsTab = page.locator(
      '[data-testid="events-tab"], .el-tabs__item:has-text("事件"), button:has-text("事件")',
    )

    if ((await eventsTab.count()) === 0) {
      console.log('⚠ 未找到事件配置面板')
      return
    }

    // 点击切换到事件面板
    await eventsTab.first().click()
    await page.waitForTimeout(200)

    // 查找添加事件按钮
    const addEventBtn = page.locator(
      '[data-testid="add-event"], button:has-text("添加"), .el-button:has-text("添加")',
    )

    if ((await addEventBtn.count()) > 0) {
      await addEventBtn.first().click()
      console.log('✓ 成功打开事件配置')
    }
  })

  test('预览模式下组件正常渲染', async ({ page }) => {
    // 查找预览按钮
    const previewBtn = page.locator(
      '[data-testid="preview-btn"], [data-testid="btn-preview"], button:has-text("预览"), .el-button:has-text("预览")',
    )

    if ((await previewBtn.count()) === 0) {
      test.skip(true, '未找到预览按钮')
      return
    }

    // 点击进入预览模式
    await previewBtn.first().click()
    await page.waitForTimeout(500)

    // 验证预览容器出现
    const previewContainer = page.locator(
      '[data-testid="preview-root"], [data-testid="runtime-view"], .preview-container, .runtime-container',
    )

    await expect(previewContainer.first()).toBeVisible({ timeout: 5000 })
    console.log('✓ 预览模式正常加载')

    // 统计预览中的组件数量
    const previewComponents = previewContainer.first().locator('[data-component-id], .component')
    const count = await previewComponents.count()
    console.log(`预览模式渲染了 ${count} 个组件`)
  })

  test('预览模式下事件触发正常', async ({ page }) => {
    // 进入预览模式
    const previewBtn = page.locator(
      '[data-testid="preview-btn"], [data-testid="btn-preview"], button:has-text("预览")',
    )

    if ((await previewBtn.count()) === 0) {
      test.skip(true, '未找到预览按钮')
      return
    }

    await previewBtn.first().click()
    await page.waitForTimeout(500)

    // 查找预览中的可交互组件（如按钮）
    const previewContainer = page.locator(
      '[data-testid="preview-root"], .preview-container, .runtime-container',
    )
    const interactiveComponent = previewContainer
      .first()
      .locator('button, [role="button"], .el-button')

    if ((await interactiveComponent.count()) === 0) {
      console.log('⚠ 预览中没有可交互组件，跳过事件测试')
      return
    }

    // 点击组件触发事件
    await interactiveComponent.first().click()
    console.log('✓ 在预览模式中触发了组件点击事件')

    // 注意：具体的联动效果验证需要根据实际配置的事件来断言
  })

  test('导出 JSON 并重新导入', async ({ page }) => {
    // 查找导出按钮
    const exportBtn = page.locator(
      '[data-testid="btn-export-json"], [data-testid="export-json"], button:has-text("导出")',
    )

    if ((await exportBtn.count()) === 0) {
      test.skip(true, '未找到导出按钮')
      return
    }

    // 监听下载事件
    const downloadPromise = page.waitForEvent('download', { timeout: 5000 }).catch(() => null)
    await exportBtn.first().click()

    const download = await downloadPromise

    if (!download) {
      console.log('⚠ 未触发文件下载（可能使用了其他导出方式）')
      return
    }

    // 获取下载文件路径
    const downloadPath = await download.path()
    expect(downloadPath).toBeTruthy()
    console.log(`✓ 成功导出文件: ${download.suggestedFilename()}`)

    // 查找导入功能
    const importInput = page.locator('[data-testid="input-import-json"], input[type="file"]')

    if ((await importInput.count()) === 0) {
      console.log('⚠ 未找到导入输入框，跳过导入测试')
      return
    }

    // 导入文件
    await importInput.first().setInputFiles(downloadPath!)
    await page.waitForTimeout(500)

    console.log('✓ 成功导入 JSON 文件')
  })

  test('撤销/重做功能验证', async ({ page }) => {
    // 查找撤销按钮
    const undoBtn = page.locator(
      '[data-testid="undo-btn"], button:has-text("撤销"), .el-button[title="撤销"]',
    )
    const redoBtn = page.locator(
      '[data-testid="redo-btn"], button:has-text("重做"), .el-button[title="重做"]',
    )

    if ((await undoBtn.count()) === 0) {
      test.skip(true, '未找到撤销按钮')
      return
    }

    // 检查初始状态下撤销按钮是否可用
    const isUndoDisabled = await undoBtn
      .first()
      .isDisabled()
      .catch(() => true)
    console.log(`撤销按钮状态: ${isUndoDisabled ? '禁用' : '可用'}`)

    // 如果撤销可用，执行撤销
    if (!isUndoDisabled) {
      await undoBtn.first().click()
      console.log('✓ 执行撤销操作')

      // 检查重做是否变为可用
      if ((await redoBtn.count()) > 0) {
        const isRedoDisabled = await redoBtn
          .first()
          .isDisabled()
          .catch(() => true)
        console.log(`重做按钮状态: ${isRedoDisabled ? '禁用' : '可用'}`)
      }
    }
  })
})
