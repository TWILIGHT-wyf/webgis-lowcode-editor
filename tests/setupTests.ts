// 全局测试设置：在 Vitest 启动时注册常用的 mocks
// 注：Vitest 配置中请将此文件加入 `setupFiles` 或在 `vitest` 配置里注册
import { vi } from 'vitest'
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
