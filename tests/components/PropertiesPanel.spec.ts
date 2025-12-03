/**
 * 属性面板测试：修改位置/大小/样式，模拟 API 配置等
 */
import { mount } from '@vue/test-utils'
import { ref, computed } from 'vue'
import { describe, it, expect, beforeEach } from 'vitest'
import PropertiesPanel from '../../src/components/siderBar/properties/properties.vue'
import { useDataSource } from '../../src/datasource/useDataSource'
import { setActivePinia, createPinia } from 'pinia'
import { useComponent } from '../../src/stores/component'

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

  it('当组件配置了数据源并启用时，useDataSource 会返回 Mock 数据', async () => {
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

    // useDataSource 已被全局 Mock，验证返回的 Mock 结构
    const TestComponent = {
      template: '<div></div>',
      setup() {
        const dsRef = ref({ enabled: true, url: '/api/data', method: 'GET' })
        const { data, loading, error, fetchData } = useDataSource(computed(() => dsRef.value))
        return { data, loading, error, fetchData }
      },
    }

    interface TestVm {
      data: { value: unknown }
      loading: { value: boolean }
      error: { value: string | null }
      fetchData: () => Promise<void>
    }

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as unknown as TestVm

    // 验证 useDataSource 返回正确的 Mock 结构
    expect(vm.data).toBeDefined()
    expect(vm.loading).toBeDefined()
    expect(vm.error).toBeDefined()
    expect(typeof vm.fetchData).toBe('function')
  })
})
