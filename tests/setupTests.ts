// 全局测试设置：在 Vitest 启动时注册常用的 mocks
// 注：Vitest 配置中请将此文件加入 `setupFiles` 或在 `vitest` 配置里注册
import { vi } from 'vitest'
import { ref, defineComponent, h } from 'vue'
import { getActivePinia, setActivePinia, createPinia } from 'pinia'
// 为组件挂载做准备
import { config as VTUConfig } from '@vue/test-utils'

interface MockLeaflet {
  map: () => {
    setView: () => void
    on: () => void
    off: () => void
    addLayer: () => void
    remove: () => void
    getCenter: () => { lat: number; lng: number }
    getZoom: () => number
  }
  tileLayer: () => { addTo: () => void }
  marker: () => { addTo: () => void; bindPopup: () => void; on: () => void; setLatLng: () => void }
  geoJSON: () => { addTo: () => void }
  circle: () => { addTo: () => void }
  DomUtil: { create: () => HTMLDivElement }
  control: { layers: () => { addTo: () => void } }
}

// 全局 mock：Leaflet（基础）
vi.mock('leaflet', () => {
  // 提供最小可用的 API 以便组件在测试中挂载
  return {
    map: () => ({
      setView: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
      addLayer: vi.fn(),
      remove: vi.fn(),
      getCenter: () => ({ lat: 0, lng: 0 }),
      getZoom: () => 1,
    }),
    tileLayer: () => ({ addTo: vi.fn() }),
    marker: () => ({ addTo: vi.fn(), bindPopup: vi.fn(), on: vi.fn(), setLatLng: vi.fn() }),
    geoJSON: () => ({ addTo: vi.fn() }),
    circle: () => ({ addTo: vi.fn() }),
    DomUtil: { create: () => document.createElement('div') },
    control: { layers: () => ({ addTo: vi.fn() }) },
  }
})

// 为兼容依赖于全局 L 的插件（例如 leaflet.markercluster），在全局暴露 L
// 直接使用与上面同样的最小实现
;(globalThis as unknown as { L: MockLeaflet }).L = {
  map: () => ({
    setView: () => {},
    on: () => {},
    off: () => {},
    addLayer: () => {},
    remove: () => {},
    getCenter: () => ({ lat: 0, lng: 0 }),
    getZoom: () => 1,
  }),
  tileLayer: () => ({ addTo: () => {} }),
  marker: () => ({ addTo: () => {}, bindPopup: () => {}, on: () => {}, setLatLng: () => {} }),
  geoJSON: () => ({ addTo: () => {} }),
  circle: () => ({ addTo: () => {} }),
  DomUtil: { create: () => document.createElement('div') },
  control: { layers: () => ({ addTo: () => {} }) },
}

// Mock 常用 leaflet 插件，避免加载真实实现导致全局依赖问题
vi.mock('leaflet.markercluster', () => ({
  MarkerClusterGroup: () => ({ addTo: () => {} }),
}))
vi.mock('leaflet.heat', () => ({ heatLayer: () => ({ addTo: () => {} }) }))

// 全局 mock：echarts
vi.mock('echarts', () => {
  return {
    init: () => ({
      setOption: vi.fn(),
      dispose: vi.fn(),
      on: vi.fn(),
      getModel: () => ({ option: {} }),
    }),
    connect: vi.fn(),
    disconnect: vi.fn(),
  }
})

/**
 * 创建一个简单的 Mock 组件，只渲染 Props 用于测试
 * @param name - 组件名称
 * @param hasSlot - 是否需要渲染 Slot
 */
function createMockComponent(name: string, hasSlot = false) {
  return defineComponent({
    name,
    props: {
      // 接受所有 props
    },
    inheritAttrs: false,
    setup(_props, { attrs, slots }) {
      return () =>
        h(
          'div',
          {
            'data-testid': `mock-${name}`,
            'data-component': name,
            ...attrs,
          },
          hasSlot && slots.default ? slots.default() : undefined,
        )
    },
  })
}

/**
 * 全局 Mock @twi1i9ht/visual-lib 组件库
 * 在测试 Smart 组件时避免真实渲染 ECharts/Leaflet 等复杂组件
 */
vi.mock('@twi1i9ht/visual-lib', () => {
  return {
    // 图表组件 Mock
    lineChart: createMockComponent('lineChart'),
    barChart: createMockComponent('barChart'),
    pieChart: createMockComponent('pieChart'),
    doughnutChart: createMockComponent('doughnutChart'),
    radarChart: createMockComponent('radarChart'),
    gaugeChart: createMockComponent('gaugeChart'),
    funnelChart: createMockComponent('funnelChart'),
    scatterChart: createMockComponent('scatterChart'),
    sankeyChart: createMockComponent('sankeyChart'),
    stackedBarChart: createMockComponent('stackedBarChart'),

    // KPI 组件 Mock
    vText: createMockComponent('vText'),
    vBox: createMockComponent('vBox'),
    vStat: createMockComponent('vStat'),
    vProgress: createMockComponent('vProgress'),
    vCountUp: createMockComponent('vCountUp'),

    // 布局组件 Mock
    vBadge: createMockComponent('vBadge'),
    vPanel: createMockComponent('vPanel', true),
    vFlex: createMockComponent('vFlex', true),
    vGrid: createMockComponent('vGrid', true),
    vTabs: createMockComponent('vTabs', true),
    vModal: createMockComponent('vModal', true),
    vRow: createMockComponent('vRow', true),
    vCol: createMockComponent('vCol', true),

    // 数据组件 Mock
    vTimeline: createMockComponent('vTimeline'),
    vTable: createMockComponent('vTable'),
    vList: createMockComponent('vList'),
    vCardGrid: createMockComponent('vCardGrid'),
    vPivot: createMockComponent('vPivot'),

    // 控件组件 Mock
    vButtonGroup: createMockComponent('vButtonGroup'),
    vCheckboxGroup: createMockComponent('vCheckboxGroup'),
    vDateRange: createMockComponent('vDateRange'),
    vMultiSelect: createMockComponent('vMultiSelect'),
    vSearchBox: createMockComponent('vSearchBox'),
    vSelect: createMockComponent('vSelect'),
    vSlider: createMockComponent('vSlider'),
    vSwitch: createMockComponent('vSwitch'),

    // 内容组件 Mock
    vHtml: createMockComponent('vHtml'),
    vIframe: createMockComponent('vIframe'),
    vMarkdown: createMockComponent('vMarkdown'),

    // 媒体组件 Mock
    vImage: createMockComponent('vImage'),
    vVideo: createMockComponent('vVideo'),

    // 高级组件 Mock
    vScripting: createMockComponent('vScripting'),
    vState: createMockComponent('vState'),
    vTrigger: createMockComponent('vTrigger'),

    // Group 组件 Mock
    vGroup: createMockComponent('vGroup', true),

    // Map 组件 Mock - 需要渲染 Slot 以支持嵌套 Marker 等
    vMap: createMockComponent('vMap', true),
    vMarker: createMockComponent('vMarker'),
    vHeatLayer: createMockComponent('vHeatLayer'),
    vGeoJsonLayer: createMockComponent('vGeoJsonLayer'),
    vClusterLayer: createMockComponent('vClusterLayer'),
    vTileLayer: createMockComponent('vTileLayer'),
    vVectorLayer: createMockComponent('vVectorLayer'),
    vLegend: createMockComponent('vLegend'),
    vScale: createMockComponent('vScale'),
    vLayers: createMockComponent('vLayers'),

    // 组件注册表 Mock
    componentRegistry: {},

    // Hooks Mock
    useDataSource: vi.fn(() => ({
      data: ref(null),
      rawData: ref(null),
      loading: ref(false),
      error: ref(null),
      fetchData: vi.fn(),
    })),

    // 工具函数 Mock
    getValueByPath: vi.fn((obj: unknown, path: string | undefined) => {
      if (!path || !obj) return undefined
      try {
        const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.')
        let result: unknown = obj
        for (const key of keys) {
          if (result === null || result === undefined) return undefined
          result = (result as Record<string, unknown>)[key]
        }
        return result
      } catch {
        return undefined
      }
    }),
    extractWithFallback: vi.fn(
      <T>(remoteData: unknown, path: string | undefined, fallbackValue: T): T => {
        if (!path) return fallbackValue
        if (!remoteData) return fallbackValue
        try {
          const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.')
          let result: unknown = remoteData
          for (const key of keys) {
            if (result === null || result === undefined) return fallbackValue
            result = (result as Record<string, unknown>)[key]
          }
          return (result ?? fallbackValue) as T
        } catch {
          return fallbackValue
        }
      },
    ),
    extractNumber: vi.fn(),
    parseNumberInput: vi.fn(),
    parseStringInput: vi.fn(),
    extractNumberArray: vi.fn(),
    extractStringArray: vi.fn(),
  }
})

// axios 全局 mock，测试中可按需被每个测试文件重写
vi.mock('axios', () => {
  const mockResponse = { data: { test: 'mocked data' } }
  const mockFn = vi.fn(() => Promise.resolve(mockResponse))
  const instance = {
    get: mockFn,
    post: mockFn,
    request: mockFn,
  }
  // axios.create 返回一个实例
  return {
    default: Object.assign(mockFn, { create: () => instance }),
    create: () => instance,
    get: mockFn,
    post: mockFn,
    request: mockFn,
  }
})

// Vue Test Utils 全局配置：插入 Pinia 并 stub 常见第三方组件（ElementPlus / v-chart）
// VTUConfig.global.plugins = [createPinia()] // 移除全局 Pinia，避免与测试中的 setActivePinia 冲突
VTUConfig.global.components = VTUConfig.global.components || {}
// 常见 Element Plus 组件与自定义图表容器（避免在单元测试中真实渲染）
const stubs = [
  'el-button',
  'el-input',
  'el-input-number',
  'el-switch',
  'el-select',
  'el-option',
  'el-slider',
  'el-color-picker',
  'el-form',
  'el-form-item',
  'el-row',
  'el-col',
  'el-collapse',
  'el-collapse-item',
  'el-alert',
  'el-space',
  'el-divider',
  'el-text',
  'el-scrollbar',
  'el-empty',
  'el-menu',
  'el-menu-item',
  'el-tabs',
  'el-tab-pane',
  'el-badge',
  'el-icon',
]
for (const name of stubs)
  VTUConfig.global.stubs = { ...(VTUConfig.global.stubs || {}), [name]: true }
// echarts 组件（vue-echarts）通常注册为 v-chart
VTUConfig.global.stubs = { ...(VTUConfig.global.stubs || {}), 'v-chart': true }

// 小工具：在组件测试中用来触发指针拖拽
export function pointerDrag(
  el: Element,
  from: { x: number; y: number },
  to: { x: number; y: number },
) {
  const create = (type: string, x: number, y: number) => {
    const ev = new PointerEvent(type, { clientX: x, clientY: y, bubbles: true })
    return ev
  }
  el.dispatchEvent(create('pointerdown', from.x, from.y))
  el.dispatchEvent(create('pointermove', (from.x + to.x) / 2, (from.y + to.y) / 2))
  el.dispatchEvent(create('pointermove', to.x, to.y))
  el.dispatchEvent(create('pointerup', to.x, to.y))
}

// 测试工具：安全设置 Pinia，避免重复设置警告
export function setupTestPinia() {
  if (!getActivePinia()) {
    setActivePinia(createPinia())
  }
}
