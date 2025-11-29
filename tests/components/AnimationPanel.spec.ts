/**
 * 动画面板测试：动画预设选择和配置
 */
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import AnimationPanel from '../../src/components/siderBar/animation/animation.vue'
import { createPinia } from 'pinia'

describe('AnimationPanel 动画面板', () => {
  it('动画面板根节点应存在', async () => {
    const wrapper = mount(AnimationPanel, {
      global: {
        plugins: [createPinia()],
      },
    })
    expect(wrapper.find('.animation-panel').exists()).toBe(true)
  })

  it('应渲染动画预设网格', async () => {
    const wrapper = mount(AnimationPanel, {
      global: {
        plugins: [createPinia()],
      },
    })
    expect(wrapper.find('.animation-grid').exists()).toBe(true)
    expect(wrapper.findAll('.anim-card').length).toBeGreaterThan(0)
  })

  it('应渲染预览舞台', async () => {
    const wrapper = mount(AnimationPanel, {
      global: {
        plugins: [createPinia()],
      },
    })
    expect(wrapper.find('.preview-stage').exists()).toBe(true)
    expect(wrapper.find('.preview-target').exists()).toBe(true)
  })
})
