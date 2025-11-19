import type { Component } from 'vue'
import Text from './kpi/text/Text.vue'
import Group from './group/Group.vue'
import lineChart from './chart/lineChart/lineChart.vue'
import barChart from './chart/barChart/barChart.vue'
import stackedBarChart from './chart/stackedBarChart/stackedBarChart.vue'

export const componentRegistry: Record<string, Component> = {
  Text: Text,
  Group: Group,
  lineChart: lineChart,
  barChart: barChart,
  stackedBarChart: stackedBarChart,
}

export function getComponent(type: string) {
  return componentRegistry[type] || 'div'
}
