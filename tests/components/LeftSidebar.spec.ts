/**
 * 左侧侧边栏测试：组件卡片库与关系图（ECharts）渲染
 */
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import LeftSidebar from '../../src/components/siderBar/siderBar.vue'
import { createPinia } from 'pinia'

describe('LeftSidebar 侧边栏', () => {
  it('组件侧边栏根节点应存在', async () => {
    const wrapper = mount(LeftSidebar, {
      global: {
        plugins: [createPinia()],
      },
    })
    expect(wrapper.find('.sider-root').exists()).toBe(true)
  })

  it('默认激活属性面板（activeIndex=1）', async () => {
    const wrapper = mount(LeftSidebar, {
      global: {
        plugins: [createPinia()],
      },
    })
    // activeIndex 默认为 '1'
    expect(wrapper.vm.activeIndex).toBe('1')
  })
})
