<template>
  <div class="stacked-bar-chart" :style="{ width: '100%', height: '100%' }">
    <v-chart :option="chartOption" autoresize class="echart" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { EChartsOption } from 'echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components'
import { useComponent } from '@/stores/component'
import { storeToRefs } from 'pinia'
import { useDataSource } from '@/datasource/useDataSource'

use([TitleComponent, TooltipComponent, GridComponent, LegendComponent, BarChart, CanvasRenderer])

const props = defineProps<{ id: string }>()

const { componentStore } = storeToRefs(useComponent())
const comp = computed(() => componentStore.value.find((c) => c.id === props.id))
const { data: remoteData } = useDataSource(computed(() => comp.value?.dataSource))

const chartOption = ref<EChartsOption>({})

function parseDataInput(input: string | undefined): number[] {
  if (!input) return []
  return input
    .split(',')
    .map((v) => parseFloat(v.trim()))
    .filter((v) => !isNaN(v))
}

function parseXAxisInput(input: string | undefined): string[] {
  if (!input) return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return input
    .split(',')
    .map((v) => v.trim())
    .filter((v) => v.length > 0)
}

function parseSeriesNamesInput(input: string | undefined): string[] {
  if (!input) return []
  return input
    .split(',')
    .map((v) => v.trim())
    .filter((v) => v.length > 0)
}

function buildOption(): EChartsOption {
  if (!comp.value) return {}

  const p = comp.value.props

  if (p.option) {
    const customOption = typeof p.option === 'string' ? JSON.parse(p.option) : p.option
    const simpleOption = buildSimpleOption()
    return {
      ...customOption,
      ...simpleOption,
    }
  }

  return buildSimpleOption()
}

function buildSimpleOption(): EChartsOption {
  if (!comp.value) return {}

  const p = comp.value.props
  const ds = comp.value.dataSource

  function getValueByPath(obj: unknown, path: string): unknown {
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
  }

  let xAxisData: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  let seriesNames: string[] = ['Series 1', 'Series 2', 'Series 3']
  let seriesData: number[][] = [
    [120, 132, 101, 134, 90, 230, 210],
    [220, 182, 191, 234, 290, 330, 310],
    [150, 232, 201, 154, 190, 330, 410],
  ]

  if (ds?.enabled && remoteData.value) {
    if (ds.xAxisPath) {
      const extractedXAxis = getValueByPath(remoteData.value, ds.xAxisPath)
      if (Array.isArray(extractedXAxis)) {
        xAxisData = extractedXAxis.map((v) => String(v))
      }
    }

    if (ds.seriesNamesPath) {
      const extractedNames = getValueByPath(remoteData.value, ds.seriesNamesPath)
      if (Array.isArray(extractedNames)) {
        seriesNames = extractedNames.map((v) => String(v))
      }
    }

    if (ds.seriesDataPath) {
      const extractedData = getValueByPath(remoteData.value, ds.seriesDataPath)
      if (Array.isArray(extractedData)) {
        seriesData = extractedData.map((series) => {
          if (Array.isArray(series)) {
            return series.map((v) => (typeof v === 'number' ? v : parseFloat(String(v))))
          }
          return []
        })
      }
    }
  } else {
    if (p.xAxisInput) {
      xAxisData = parseXAxisInput(p.xAxisInput as string)
    } else if (p.xAxisData) {
      xAxisData = p.xAxisData as string[]
    }

    if (p.seriesNamesInput) {
      seriesNames = parseSeriesNamesInput(p.seriesNamesInput as string)
    } else if (p.seriesNames) {
      seriesNames = p.seriesNames as string[]
    }

    if (p.series1Input) {
      seriesData[0] = parseDataInput(p.series1Input as string)
    }
    if (p.series2Input) {
      seriesData[1] = parseDataInput(p.series2Input as string)
    }
    if (p.series3Input) {
      seriesData[2] = parseDataInput(p.series3Input as string)
    }

    if (p.seriesData && Array.isArray(p.seriesData)) {
      seriesData = p.seriesData as number[][]
    }
  }

  const colors = [
    (p.color1 as string) || '#5470c6',
    (p.color2 as string) || '#91cc75',
    (p.color3 as string) || '#fac858',
  ]

  const simpleOption: EChartsOption = {
    color: colors,
    title: p.title
      ? {
          text: p.title as string,
          left: 'center',
          textStyle: {
            fontSize: 16,
          },
        }
      : undefined,

    tooltip:
      p.showTooltip !== false
        ? {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
          }
        : undefined,

    legend:
      p.showLegend !== false
        ? {
            [(p.legendPosition as string) || 'top']: 10,
            data: seriesNames,
          }
        : undefined,

    grid: {
      left: '6%',
      right: '6%',
      bottom: '8%',
      top: p.title ? '15%' : '10%',
      containLabel: true,
      show: p.showGrid !== false,
    },

    xAxis: {
      type: 'category',
      data: xAxisData,
      name: (p.xAxisName as string) || '',
      nameLocation: 'middle',
      nameGap: 30,
      axisLine: {
        show: p.showXAxisLine !== false,
      },
      axisLabel: {
        show: p.showXAxisLabel !== false,
      },
      splitLine: {
        show: false,
      },
    },

    yAxis: {
      type: 'value',
      name: (p.yAxisName as string) || '',
      nameLocation: 'middle',
      nameGap: 50,
      axisLine: {
        show: p.showYAxisLine !== false,
      },
      axisLabel: {
        show: p.showYAxisLabel !== false,
      },
      splitLine: {
        show: p.showGrid !== false,
      },
    },

    series: seriesData.map((data, index) => ({
      name: seriesNames[index] || `Series ${index + 1}`,
      type: 'bar',
      stack: 'total',
      data: data,
      barWidth: (p.barWidth as string) || '60%',
      itemStyle: {
        borderRadius: index === seriesData.length - 1 ? (p.borderRadius as number) || 0 : 0,
      },
      label: p.showLabel
        ? {
            show: true,
            position: 'inside',
            fontSize: 12,
          }
        : undefined,
    })),
  }

  return simpleOption
}

watch(
  [() => comp.value?.props, () => comp.value?.dataSource, remoteData],
  () => {
    chartOption.value = buildOption()
  },
  { deep: true, immediate: true },
)
</script>

<style scoped>
.stacked-bar-chart {
  width: 100%;
  height: 100%;
}
.echart {
  width: 100%;
  height: 100%;
}
</style>
