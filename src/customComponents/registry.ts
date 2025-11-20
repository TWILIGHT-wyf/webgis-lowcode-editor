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

export const componentRegistry: Record<string, Component> = {
  Text: Text,
  Group: Group,
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
}

export function getComponent(type: string) {
  return componentRegistry[type] || 'div'
}
