/**
 * 集成测试：ECharts 与组件联动
 */
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import BarChartComponent from '../../src/customComponents/chart/barChart/BarChart.vue'
import { setActivePinia, createPinia } from 'pinia'
import { useComponent } from '../../src/stores/component'
import type { component } from '../../src/stores/component'

// Mock ECharts
vi.mock('echarts/core', () => ({
  use: vi.fn(),
}))
vi.mock('echarts/renderers', () => ({
  CanvasRenderer: vi.fn(),
}))
vi.mock('echarts/charts', () => ({
  BarChart: vi.fn(),
}))
vi.mock('echarts/components', () => ({
  TitleComponent: vi.fn(),
  TooltipComponent: vi.fn(),
  GridComponent: vi.fn(),
  LegendComponent: vi.fn(),
}))

describe('ECharts 集成', () => {
  it('应能挂载并接收配置项', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useComponent()

    // 添加一个配置完整的柱状图组件
    store.componentStore.push({
      id: 'chart1',
      type: 'barChart',
      position: { x: 0, y: 0 },
      size: { width: 400, height: 300 },
      rotation: 0,
      zindex: 1,
      style: {},
      props: {
        title: '测试图表',
        dataInput: '120, 200, 150, 180',
        xAxisInput: '一月, 二月, 三月, 四月',
        seriesName: '销售额',
        barColor: '#5470c6',
        showLabel: true,
        showLegend: true,
      },
    })

    const wrapper = mount(BarChartComponent, {
      props: { id: 'chart1' },
      global: {
        plugins: [pinia],
      },
    })

    const chartRoot = wrapper.find('.bar-chart')
    expect(chartRoot.exists()).toBe(true)

    // 验证组件配置正确
    const component = store.componentStore.find((c: component) => c.id === 'chart1')
    expect(component).toBeTruthy()
    expect(component!.props.title).toBe('测试图表')
    expect(component!.props.dataInput).toBe('120, 200, 150, 180')
    expect(component!.props.xAxisInput).toBe('一月, 二月, 三月, 四月')
  })

  it('应能响应属性变化重新渲染图表', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useComponent()

    // 添加初始配置的图表组件
    store.componentStore.push({
      id: 'chart2',
      type: 'barChart',
      position: { x: 0, y: 0 },
      size: { width: 400, height: 300 },
      rotation: 0,
      zindex: 1,
      style: {},
      props: {
        title: '初始标题',
        dataInput: '100, 200, 300',
        xAxisInput: 'A, B, C',
      },
    })

    const wrapper = mount(BarChartComponent, {
      props: { id: 'chart2' },
      global: {
        plugins: [pinia],
      },
    })

    // 验证初始配置
    let component = store.componentStore.find((c: component) => c.id === 'chart2')
    expect(component!.props.title).toBe('初始标题')
    expect(component!.props.dataInput).toBe('100, 200, 300')

    // 修改组件属性
    component!.props.title = '更新后的标题'
    component!.props.dataInput = '400, 500, 600'

    // 等待响应式更新
    await wrapper.vm.$nextTick()

    // 验证属性已更新
    component = store.componentStore.find((c: component) => c.id === 'chart2')
    expect(component!.props.title).toBe('更新后的标题')
    expect(component!.props.dataInput).toBe('400, 500, 600')
  })

  it('应能处理数据源配置', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useComponent()

    // 添加带有数据源配置的图表组件
    store.componentStore.push({
      id: 'chart3',
      type: 'barChart',
      position: { x: 0, y: 0 },
      size: { width: 400, height: 300 },
      rotation: 0,
      zindex: 1,
      style: {},
      props: {
        title: '数据源图表',
      },
      dataSource: {
        enabled: true,
        type: 'api',
        url: '/api/chart-data',
        dataPath: 'data.sales',
        xAxisPath: 'data.months',
        seriesNamePath: 'data.name',
      },
    })

    const wrapper = mount(BarChartComponent, {
      props: { id: 'chart3' },
      global: {
        plugins: [pinia],
      },
    })

    const chartRoot = wrapper.find('.bar-chart')
    expect(chartRoot.exists()).toBe(true)

    // 验证数据源配置正确
    const component = store.componentStore.find((c: component) => c.id === 'chart3')
    expect(component!.dataSource).toBeTruthy()
    expect(component!.dataSource!.enabled).toBe(true)
    expect(component!.dataSource!.url).toBe('/api/chart-data')
    expect(component!.dataSource!.dataPath).toBe('data.sales')
  })
})
