/**
 * 动画面板测试：动画预设选择和配置
 */
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import AnimationPanel from '../../src/components/siderBar/animation/animation.vue'
import { createPinia } from 'pinia'

describe('AnimationPanel 动画面板', () => {
  // 通用挂载选项：Stub Element Plus 组件
  const mountOptions = {
    global: {
      plugins: [createPinia()],
      stubs: {
        // 关键：将 el-scrollbar 替换为普通 div，确保内容能渲染出来
        'el-scrollbar': {
          template: '<div><slot /></div>',
        },
        // 其他 UI 组件 stub 掉，消除警告
        'el-form': true,
        'el-form-item': true,
        'el-select': true,
        'el-option': true,
        'el-input-number': true,
        'el-radio-group': true,
        'el-radio-button': true,
      },
    },
  }

  it('动画面板根节点应存在', async () => {
    const wrapper = mount(AnimationPanel, mountOptions)
    expect(wrapper.find('.animation-panel').exists()).toBe(true)
  })

  it('应渲染动画预设网格', async () => {
    const wrapper = mount(AnimationPanel, mountOptions)
    // 现在 el-scrollbar 被 stub 了，内部的 grid 应该能被找到了
    expect(wrapper.find('.animation-grid').exists()).toBe(true)
    // 验证是否渲染了动画卡片 (假设 animations 数据不为空)
    expect(wrapper.findAll('.anim-card').length).toBeGreaterThan(0)
  })

  it('应渲染预览舞台', async () => {
    const wrapper = mount(AnimationPanel, mountOptions)
    expect(wrapper.find('.preview-stage').exists()).toBe(true)
    expect(wrapper.find('.preview-target').exists()).toBe(true)
  })
})
