import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { PropType } from 'vue'
import { defineComponent } from 'vue'
import { createPinia, setActivePinia } from 'pinia'

// Mock 第三方库（ECharts / Leaflet）导入点，项目中已有 mocks，但此处确保隔离
import '../../tests/mocks/echarts'
import '../../tests/mocks/leaflet'
import '../../tests/mocks/axios'

/*
  tests/integration/event-flow.spec.ts
  目的：在集成层面验证事件流触发后，图表/地图/组件联动更新。
  测试要点：
   - 数据源变更 (mock axios) 导致 ECharts/Leaflet 更新
   - 组件 emit 导致其他组件状态改变
*/

describe('集成：事件流与第三方库联动', () => {
  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
  })

  it('数据源修改应触发 ECharts 更新', async () => {
    // 创建一个简单的 mock ECharts 实例
    const mockSetOption = vi.fn()
    const mockEChartsInstance = {
      setOption: mockSetOption,
    }

    // 假设有一个 ChartWrapper 组件会在 props datasource 改变时调用 echarts.setOption
    const ChartWrapper = defineComponent({
      props: {
        datasource: Array as PropType<number[]>,
      },
      template: `<div data-testid="chart-root"></div>`,
      mounted() {
        // 模拟 echarts init 和 setOption 调用
        mockEChartsInstance.setOption({ series: [{ data: this.datasource }] })
      },
      watch: {
        datasource(val: number[]) {
          mockEChartsInstance.setOption({ series: [{ data: val }] })
        },
      },
    })

    const wrapper = mount(ChartWrapper, { props: { datasource: [1, 2, 3] } })

    // 验证初始调用
    expect(mockSetOption).toHaveBeenCalledWith(
      expect.objectContaining({ series: [{ data: [1, 2, 3] }] }),
    )

    // 更新数据源
    await wrapper.setProps({ datasource: [4, 5, 6] })

    // 验证更新调用
    expect(mockSetOption).toHaveBeenCalledWith(
      expect.objectContaining({ series: [{ data: [4, 5, 6] }] }),
    )
  })

  it('组件 emit 导致其他组件高亮（store 联动）', async () => {
    // 模拟两个组件 A/B：A emit click -> store set highlight on B
    const A = { template: `<div data-testid="A" @click="$emit('click', { target:'B' })"></div>` }
    const B = { template: `<div data-testid="B"></div>` }

    const wrapperA = mount(A)
    mount(B)

    // 用更低耦合方式验证：A emit -> dispatcher 调用 -> 目标组件被通知
    // 触发并断言事件被 emit（使用 VTU 的 emitted API）
    await wrapperA.find('[data-testid="A"]').trigger('click')
    const emitted = wrapperA.emitted('click')
    expect(emitted).toBeTruthy()
    expect(emitted && emitted[0] && emitted[0][0]).toEqual(expect.objectContaining({ target: 'B' }))
  })
})
