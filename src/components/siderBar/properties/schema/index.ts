/**
 * Schema 自动加载入口
 * 导入所有组件的 schema 配置并导出统一的获取接口
 */

// 导入类型和工具函数
export * from './types'

// 导入各组件的 schema（会自动注册）

// Controls 组件
import '@/customComponents/controls/navButton/schema'
import '@/customComponents/controls/breadcrumb/schema'
import '@/customComponents/controls/pagination/schema'
import '@/customComponents/controls/select/schema'
import '@/customComponents/controls/multiSelect/schema'
import '@/customComponents/controls/dateRange/schema'
import '@/customComponents/controls/searchBox/schema'
import '@/customComponents/controls/slider/schema'
import '@/customComponents/controls/switch/schema'
import '@/customComponents/controls/checkboxGroup/schema'
import '@/customComponents/controls/buttonGroup/schema'

// KPI 组件
import '@/customComponents/kpi/stat/schema'
import '@/customComponents/kpi/countUp/schema'
import '@/customComponents/kpi/progress/schema'
import '@/customComponents/kpi/badge/schema'
import '@/customComponents/kpi/box/schema'

// Chart 组件
import '@/customComponents/chart/lineChart/schema'
import '@/customComponents/chart/barChart/schema'
import '@/customComponents/chart/stackedBarChart/schema'
import '@/customComponents/chart/pieChart/schema'
import '@/customComponents/chart/doughnutChart/schema'
import '@/customComponents/chart/scatterChart/schema'
import '@/customComponents/chart/radarChart/schema'
import '@/customComponents/chart/gaugeChart/schema'
import '@/customComponents/chart/funnelChart/schema'
import '@/customComponents/chart/sankeyChart/schema'

// Content 组件
import '@/customComponents/content/html/schema'
import '@/customComponents/content/iframe/schema'
import '@/customComponents/content/markdown/schema'

// Layout 组件
import '@/customComponents/layout/row/schema'
import '@/customComponents/layout/col/schema'
import '@/customComponents/layout/flex/schema'
import '@/customComponents/layout/grid/schema'
import '@/customComponents/layout/modal/schema'
import '@/customComponents/layout/panel/schema'
import '@/customComponents/layout/tabs/schema'

// Media 组件
import '@/customComponents/media/image/schema'
import '@/customComponents/media/video/schema'

// Data 组件
import '@/customComponents/data/table/schema'
import '@/customComponents/data/list/schema'
import '@/customComponents/data/timeline/schema'
import '@/customComponents/data/cardGrid/schema'
import '@/customComponents/data/pivot/schema'

// Map 组件
import '@/customComponents/map/base/schema'
import '@/customComponents/map/tile/schema'
import '@/customComponents/map/vector/schema'
import '@/customComponents/map/geojson/schema'
import '@/customComponents/map/marker/schema'
import '@/customComponents/map/cluster/schema'
import '@/customComponents/map/heat/schema'
import '@/customComponents/map/legend/schema'
import '@/customComponents/map/layers/schema'
import '@/customComponents/map/scale/schema'

// Advanced 组件
import '@/customComponents/advanced/scripting/schema'
import '@/customComponents/advanced/state/schema'
import '@/customComponents/advanced/trigger/schema'

/**
 * 使用 import.meta.glob 可以实现真正的自动加载
 * 但考虑到 tree-shaking 和显式依赖的优势，这里采用显式导入
 *
 * 如需自动加载，可以使用：
 * const schemaModules = import.meta.glob('@/customComponents/** /schema.ts', { eager: true })
 */
