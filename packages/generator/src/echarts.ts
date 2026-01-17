/**
 * ECharts 按需加载配置
 * 只导入使用到的图表和组件，大幅减少打包体积
 */
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'

// 按需导入图表类型
import {
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  RadarChart,
  GaugeChart,
  FunnelChart,
  SankeyChart,
} from 'echarts/charts'

// 按需导入组件
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  ToolboxComponent,
  DataZoomComponent,
  VisualMapComponent,
} from 'echarts/components'

// 注册必要的组件
use([
  CanvasRenderer,
  // 图表
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  RadarChart,
  GaugeChart,
  FunnelChart,
  SankeyChart,
  // 组件
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  ToolboxComponent,
  DataZoomComponent,
  VisualMapComponent,
])

// 导出 VChart 组件供按需使用
export { default as VChart } from 'vue-echarts'

// 导出类型
export type { EChartsOption } from 'echarts'
