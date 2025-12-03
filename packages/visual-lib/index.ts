import type { App } from 'vue'
// packages/visual-lib/index.ts

// 1. 导出图表组件
import lineChart from './src/components/chart/lineChart/lineChart.vue'
import barChart from './src/components/chart/barChart/barChart.vue'
import pieChart from './src/components/chart/pieChart/pieChart.vue'
import doughnutChart from './src/components/chart/doughnutChart/doughnutChart.vue'
import radarChart from './src/components/chart/radarChart/radarChart.vue'
import gaugeChart from './src/components/chart/gaugeChart/gaugeChart.vue'
import funnelChart from './src/components/chart/funnelChart/funnelChart.vue'
import scatterChart from './src/components/chart/scatterChart/scatterChart.vue'
import sankeyChart from './src/components/chart/sankeyChart/sankeyChart.vue'
import stackedBarChart from './src/components/chart/stackedBarChart/stackedBarChart.vue'

// 2. 导出 KPI 组件
import vText from './src/components/kpi/text/Text.vue'
import vBox from './src/components/kpi/box/Box.vue'
import vStat from './src/components/kpi/stat/Stat.vue'
import vProgress from './src/components/kpi/progress/Progress.vue'
import vCountUp from './src/components/kpi/countUp/CountUp.vue'

// 3. 导出布局组件
import vBadge from './src/components/layout/badge/Badge.vue'
import vPanel from './src/components/layout/panel/Panel.vue'
import vFlex from './src/components/layout/flex/Flex.vue'
import vGrid from './src/components/layout/grid/Grid.vue'
import vTabs from './src/components/layout/tabs/Tabs.vue'
import vModal from './src/components/layout/modal/Modal.vue'
import vRow from './src/components/layout/row/Row.vue'
import vCol from './src/components/layout/col/Col.vue'

// 4. 导出数据组件
import vTimeline from './src/components/data/timeline/Timeline.vue'
import vTable from './src/components/data/table/Table.vue'
import vList from './src/components/data/list/List.vue'
import vCardGrid from './src/components/data/cardGrid/CardGrid.vue'
import vPivot from './src/components/data/pivot/Pivot.vue'

export {
  // 图表组件
  lineChart,
  barChart,
  pieChart,
  doughnutChart,
  radarChart,
  gaugeChart,
  funnelChart,
  scatterChart,
  sankeyChart,
  stackedBarChart,
  // KPI 组件
  vText,
  vBox,
  vStat,
  vProgress,
  vCountUp,
  // 布局组件
  vBadge,
  vPanel,
  vFlex,
  vGrid,
  vTabs,
  vModal,
  vRow,
  vCol,
  // 数据组件
  vTimeline,
  vTable,
  vList,
  vCardGrid,
  vPivot,
}

// 3. 导出 Hooks
// 注意：hooks 文件实际名为 useDataSource.ts，之前引用 useDataFetch 会导致找不到模块／类型
export * from './src/hooks/useDataSource'

// 4. 导出工具函数
export * from './src/utils/dataUtils'

// 5. (可选) 提供一个 Vue 插件式的安装方法
export default {
  install(app: App) {
    // 图表组件
    app.component('lineChart', lineChart)
    app.component('barChart', barChart)
    app.component('pieChart', pieChart)
    app.component('doughnutChart', doughnutChart)
    app.component('radarChart', radarChart)
    app.component('gaugeChart', gaugeChart)
    app.component('funnelChart', funnelChart)
    app.component('scatterChart', scatterChart)
    app.component('sankeyChart', sankeyChart)
    app.component('stackedBarChart', stackedBarChart)
    // KPI 组件
    app.component('vText', vText)
    app.component('vBox', vBox)
    app.component('vStat', vStat)
    app.component('vProgress', vProgress)
    app.component('vCountUp', vCountUp)
    // 布局组件
    app.component('vBadge', vBadge)
    app.component('vPanel', vPanel)
    app.component('vFlex', vFlex)
    app.component('vGrid', vGrid)
    app.component('vTabs', vTabs)
    app.component('vModal', vModal)
    app.component('vRow', vRow)
    app.component('vCol', vCol)
    // 数据组件
    app.component('vTimeline', vTimeline)
    app.component('vTable', vTable)
    app.component('vList', vList)
    app.component('vCardGrid', vCardGrid)
    app.component('vPivot', vPivot)
  },
}
