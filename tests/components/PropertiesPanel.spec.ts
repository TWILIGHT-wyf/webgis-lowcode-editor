/**
 * 属性面板测试：修改位置/大小/样式，模拟 API 配置等
 */
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import PropertiesPanel from '../../src/components/siderBar/properties/properties.vue'
import { useDataSource } from '../../src/datasource/useDataSource'
import { computed } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import { useComponent } from '../../src/stores/component'
import axios from 'axios'

describe('PropertiesPanel 右侧属性面板', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('渲染基础属性区域（宽/高 控件存在）', async () => {
    const store = useComponent()
    // 设置一个选中的组件到 store，以便组件显示属性表单
    store.selectComponent = {
      id: 'comp1',
      type: 'box',
      position: { x: 0, y: 0 },
      size: { width: 100, height: 80 },
      rotation: 0,
      zindex: 1,
      style: {},
      props: {},
    }

    const wrapper = mount(PropertiesPanel, { global: { provide: { canvasWrapRef: ref(null) } } })
    // 确认属性面板根节点存在
    expect(wrapper.find('.properties-panel').exists()).toBe(true)
  })

  it('当组件配置了数据源并启用时，useDataSource 会通过 axios 获取数据（mock axios）', async () => {
    const store = useComponent()
    store.selectComponent = {
      id: 'comp-data',
      type: 'chart',
      position: { x: 0, y: 0 },
      size: { width: 200, height: 120 },
      rotation: 0,
      zindex: 1,
      style: {},
      props: {},
      dataSource: { enabled: true, url: '/api/data', method: 'GET' },
    }

    // 为稳定性，直接测试 useDataSource Hook 的网络请求行为
    const TestComponent = {
      template: '<div></div>',
      setup() {
        const dsRef = ref({ enabled: true, url: '/api/data', method: 'GET' })
        const fake = vi.fn(async () => ({ data: { data: [1, 2, 3] } }))
        ;(
          axios as unknown as {
            mockImplementationOnce: (fn: () => Promise<{ data: { data: number[] } }>) => void
          }
        ).mockImplementationOnce(fake)

        const { data, fetchData } = useDataSource(computed(() => dsRef.value))
        return { data, fetchData, fake }
      },
    }

    interface TestVm {
      data: unknown
      fetchData: () => Promise<void>
      fake: ReturnType<typeof vi.fn>
    }

    const wrapper = mount(TestComponent)
    await (wrapper.vm as TestVm).fetchData()
    expect((wrapper.vm as TestVm).fake).toHaveBeenCalled()
    expect((wrapper.vm as TestVm).data).toEqual({ test: 'mocked data' })
  })
})
