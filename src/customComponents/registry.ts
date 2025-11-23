import type { Component } from 'vue'
import Text from './kpi/text/Text.vue'
import Group from './group/Group.vue'
import lineChart from './chart/lineChart/lineChart.vue'
import barChart from './chart/barChart/barChart.vue'
import stackedBarChart from './chart/stackedBarChart/stackedBarChart.vue'
import pieChart from './chart/pieChart/pieChart.vue'
import doughnutChart from './chart/doughnutChart/doughnutChart.vue'
import scatterChart from './chart/scatterChart/scatterChart.vue'
import radarChart from './chart/radarChart/radarChart.vue'
import gaugeChart from './chart/gaugeChart/gaugeChart.vue'
import funnelChart from './chart/funnelChart/funnelChart.vue'
import sankeyChart from './chart/sankeyChart/sankeyChart.vue'
import stat from './kpi/stat/stat.vue'
import countUp from './kpi/countUp/countUp.vue'
import progress from './kpi/progress/progress.vue'
import badge from './kpi/badge/badge.vue'
import box from './kpi/box/box.vue'
import table from './data/table/table.vue'
import list from './data/list/list.vue'
import timeline from './data/timeline/timeline.vue'
import cardGrid from './data/cardGrid/cardGrid.vue'
import pivot from './data/pivot/pivot.vue'
import select from './controls/select/select.vue'
import multiSelect from './controls/multiSelect/multiSelect.vue'
import dateRange from './controls/dateRange/dateRange.vue'
import searchBox from './controls/searchBox/searchBox.vue'
import slider from './controls/slider/slider.vue'
import switchComp from './controls/switch/switch.vue'
import checkboxGroup from './controls/checkboxGroup/checkboxGroup.vue'
import buttonGroup from './controls/buttonGroup/buttonGroup.vue'
import row from './layout/row/row.vue'
import col from './layout/col/col.vue'
import flex from './layout/flex/flex.vue'
import grid from './layout/grid/grid.vue'
import modal from './layout/modal/modal.vue'
import panel from './layout/panel/panel.vue'
import tabs from './layout/tabs/tabs.vue'
import image from './media/image/image.vue'
import video from './media/video/video.vue'
import markdown from './content/markdown/markdown.vue'
import html from './content/html/html.vue'
import iframe from './content/iframe/iframe.vue'
import scripting from './advanced/scripting/scripting.vue'
import state from './advanced/state/state.vue'
import trigger from './advanced/trigger/trigger.vue'
import base from './map/base/base.vue'
import tile from './map/tile/tile.vue'
import vector from './map/vector/vector.vue'
import geojson from './map/geojson/geojson.vue'
import marker from './map/marker/marker.vue'
import cluster from './map/cluster/cluster.vue'
import heat from './map/heat/heat.vue'
import legend from './map/legend/legend.vue'
import scale from './map/scale/scale.vue'
import layers from './map/layers/layers.vue'

export const componentRegistry: Record<string, Component> = {
  Text: Text,
  Group: Group,
  //图表
  lineChart: lineChart,
  barChart: barChart,
  stackedBarChart: stackedBarChart,
  pieChart: pieChart,
  doughnutChart: doughnutChart,
  scatterChart: scatterChart,
  radarChart: radarChart,
  gaugeChart: gaugeChart,
  funnelChart: funnelChart,
  sankeyChart: sankeyChart,
  //KPI
  stat: stat,
  countUp: countUp,
  progress: progress,
  badge: badge,
  box: box,
  //数据与列表
  table: table,
  list: list,
  timeline: timeline,
  cardGrid: cardGrid,
  pivot: pivot,
  //交互控件
  select: select,
  multiSelect: multiSelect,
  dateRange: dateRange,
  searchBox: searchBox,
  slider: slider,
  switch: switchComp,
  checkboxGroup: checkboxGroup,
  buttonGroup: buttonGroup,
  //布局容器
  row: row,
  col: col,
  flex: flex,
  grid: grid,
  modal: modal,
  panel: panel,
  tabs: tabs,
  //媒体组件
  image: image,
  video: video,
  //内容组件
  markdown: markdown,
  html: html,
  iframe: iframe,
  //高级功能
  scripting: scripting,
  state: state,
  trigger: trigger,
  //地图组件
  base: base,
  tile: tile,
  vector: vector,
  geojson: geojson,
  marker: marker,
  cluster: cluster,
  heat: heat,
  legend: legend,
  scale: scale,
  layers: layers,
}

export function getComponent(type: string) {
  return componentRegistry[type] || 'div'
}
