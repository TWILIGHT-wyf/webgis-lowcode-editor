/**
 * Schema 自动加载入口
 * 导入所有组件的 schema 配置并导出统一的获取接口
 */

// 导入类型和工具函数
export * from './types'

// 导入各组件的 schema（会自动注册）

// Controls 组件
import '@/customComponents/controls/navButton/schema.ts'
import '@/customComponents/controls/breadcrumb/schema.ts'
import '@/customComponents/controls/pagination/schema.ts'
import '@/customComponents/controls/select/schema.ts'
import '@/customComponents/controls/multiSelect/schema.ts'
import '@/customComponents/controls/dateRange/schema.ts'
import '@/customComponents/controls/searchBox/schema.ts'
import '@/customComponents/controls/slider/schema.ts'
import '@/customComponents/controls/switch/schema.ts'
import '@/customComponents/controls/checkboxGroup/schema.ts'
import '@/customComponents/controls/buttonGroup/schema.ts'

// KPI 组件
import '@/customComponents/kpi/stat/schema.ts'
import '@/customComponents/kpi/countUp/schema.ts'
import '@/customComponents/kpi/progress/schema.ts'
import '@/customComponents/kpi/badge/schema.ts'
import '@/customComponents/kpi/box/schema.ts'

// Chart 组件
import '@/customComponents/chart/lineChart/schema.ts'
import '@/customComponents/chart/barChart/schema.ts'
import '@/customComponents/chart/stackedBarChart/schema.ts'
import '@/customComponents/chart/pieChart/schema.ts'
import '@/customComponents/chart/doughnutChart/schema.ts'
import '@/customComponents/chart/scatterChart/schema.ts'
import '@/customComponents/chart/radarChart/schema.ts'
import '@/customComponents/chart/gaugeChart/schema.ts'
import '@/customComponents/chart/funnelChart/schema.ts'
import '@/customComponents/chart/sankeyChart/schema.ts'

// Content 组件
import '@/customComponents/content/html/schema.ts'
import '@/customComponents/content/iframe/schema.ts'
import '@/customComponents/content/markdown/schema.ts'

// Layout 组件
import '@/customComponents/layout/row/schema.ts'
import '@/customComponents/layout/col/schema.ts'
import '@/customComponents/layout/flex/schema.ts'
import '@/customComponents/layout/grid/schema.ts'
import '@/customComponents/layout/modal/schema.ts'
import '@/customComponents/layout/panel/schema.ts'
import '@/customComponents/layout/tabs/schema.ts'

// Media 组件
import '@/customComponents/media/image/schema.ts'
import '@/customComponents/media/video/schema.ts'

// Data 组件
import '@/customComponents/data/table/schema.ts'
import '@/customComponents/data/list/schema.ts'
import '@/customComponents/data/timeline/schema.ts'
import '@/customComponents/data/cardGrid/schema.ts'
import '@/customComponents/data/pivot/schema.ts'

// Map 组件
import '@/customComponents/map/base/schema.ts'
import '@/customComponents/map/tile/schema.ts'
import '@/customComponents/map/vector/schema.ts'
import '@/customComponents/map/geojson/schema.ts'
import '@/customComponents/map/marker/schema.ts'
import '@/customComponents/map/cluster/schema.ts'
import '@/customComponents/map/heat/schema.ts'
import '@/customComponents/map/legend/schema.ts'
import '@/customComponents/map/layers/schema.ts'
import '@/customComponents/map/scale/schema.ts'

// Advanced 组件
import '@/customComponents/advanced/scripting/schema.ts'
import '@/customComponents/advanced/state/schema.ts'
import '@/customComponents/advanced/trigger/schema.ts'

/**
 * 使用 import.meta.glob 可以实现真正的自动加载
 * 但考虑到 tree-shaking 和显式依赖的优势，这里采用显式导入
 *
 * 如需自动加载，可以使用：
 * const schemaModules = import.meta.glob('@/customComponents/** /schema.ts', { eager: true })
 */
