/**
 * Schema 自动加载入口
 * 导入所有组件的 schema 配置并导出统一的获取接口
 */

// 导入类型和工具函数
export * from './types'

// 导入各组件的 schema（会自动注册）

// Controls 组件
import '@lowcode/materials/controls/navButton/schema.ts'
import '@lowcode/materials/controls/breadcrumb/schema.ts'
import '@lowcode/materials/controls/pagination/schema.ts'
import '@lowcode/materials/controls/select/schema.ts'
import '@lowcode/materials/controls/multiSelect/schema.ts'
import '@lowcode/materials/controls/dateRange/schema.ts'
import '@lowcode/materials/controls/searchBox/schema.ts'
import '@lowcode/materials/controls/slider/schema.ts'
import '@lowcode/materials/controls/switch/schema.ts'
import '@lowcode/materials/controls/checkboxGroup/schema.ts'
import '@lowcode/materials/controls/buttonGroup/schema.ts'

// KPI 组件
import '@lowcode/materials/kpi/stat/schema.ts'
import '@lowcode/materials/kpi/countUp/schema.ts'
import '@lowcode/materials/kpi/progress/schema.ts'
import '@lowcode/materials/kpi/badge/schema.ts'
import '@lowcode/materials/kpi/box/schema.ts'

// Chart 组件
import '@lowcode/materials/chart/lineChart/schema.ts'
import '@lowcode/materials/chart/barChart/schema.ts'
import '@lowcode/materials/chart/stackedBarChart/schema.ts'
import '@lowcode/materials/chart/pieChart/schema.ts'
import '@lowcode/materials/chart/doughnutChart/schema.ts'
import '@lowcode/materials/chart/scatterChart/schema.ts'
import '@lowcode/materials/chart/radarChart/schema.ts'
import '@lowcode/materials/chart/gaugeChart/schema.ts'
import '@lowcode/materials/chart/funnelChart/schema.ts'
import '@lowcode/materials/chart/sankeyChart/schema.ts'

// Content 组件
import '@lowcode/materials/content/html/schema.ts'
import '@lowcode/materials/content/iframe/schema.ts'
import '@lowcode/materials/content/markdown/schema.ts'

// Layout 组件
import '@lowcode/materials/layout/row/schema.ts'
import '@lowcode/materials/layout/col/schema.ts'
import '@lowcode/materials/layout/flex/schema.ts'
import '@lowcode/materials/layout/grid/schema.ts'
import '@lowcode/materials/layout/modal/schema.ts'
import '@lowcode/materials/layout/panel/schema.ts'
import '@lowcode/materials/layout/tabs/schema.ts'

// Media 组件
import '@lowcode/materials/media/image/schema.ts'
import '@lowcode/materials/media/video/schema.ts'

// Data 组件
import '@lowcode/materials/data/table/schema.ts'
import '@lowcode/materials/data/list/schema.ts'
import '@lowcode/materials/data/timeline/schema.ts'
import '@lowcode/materials/data/cardGrid/schema.ts'
import '@lowcode/materials/data/pivot/schema.ts'

// Advanced 组件
import '@lowcode/materials/advanced/scripting/schema.ts'
import '@lowcode/materials/advanced/state/schema.ts'
import '@lowcode/materials/advanced/trigger/schema.ts'

/**
 * 使用 import.meta.glob 可以实现真正的自动加载
 * 但考虑到 tree-shaking 和显式依赖的优势，这里采用显式导入
 *
 * 如需自动加载，可以使用：
 * const schemaModules = import.meta.glob('@/customComponents/** /schema.ts', { eager: true })
 */
