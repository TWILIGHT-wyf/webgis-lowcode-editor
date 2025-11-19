<template>
  <div class="bar-chart" :style="{ width: '100%', height: '100%' }">
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
  if (!input) return [120, 200, 150, 180, 270, 210, 220]
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

  let data: number[] = [120, 200, 150, 180, 270, 210, 220]
  let xAxisData: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  let seriesName: string = (p.seriesName as string) || 'Series'

  if (ds?.enabled && remoteData.value) {
    if (ds.dataPath) {
      const extractedData = getValueByPath(remoteData.value, ds.dataPath)
      if (Array.isArray(extractedData)) {
        data = extractedData.map((v) => (typeof v === 'number' ? v : parseFloat(String(v))))
      }
    }

    if (ds.xAxisPath) {
      const extractedXAxis = getValueByPath(remoteData.value, ds.xAxisPath)
      if (Array.isArray(extractedXAxis)) {
        xAxisData = extractedXAxis.map((v) => String(v))
      }
    }

    if (ds.seriesNamePath) {
      const extractedName = getValueByPath(remoteData.value, ds.seriesNamePath)
      if (extractedName) {
        seriesName = String(extractedName)
      }
    }
  } else {
    if (p.dataInput) {
      data = parseDataInput(p.dataInput as string)
    } else if (p.data) {
      data = p.data as number[]
    }

    if (p.xAxisInput) {
      xAxisData = parseXAxisInput(p.xAxisInput as string)
    } else if (p.xAxisData) {
      xAxisData = p.xAxisData as string[]
    }
  }

  const simpleOption: EChartsOption = {
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
            data: [seriesName],
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

    series: [
      {
        name: seriesName,
        type: 'bar',
        data: data,
        barWidth: (p.barWidth as string) || '60%',
        itemStyle: {
          color: (p.barColor as string) || '#5470c6',
          borderRadius: (p.borderRadius as number) || 0,
        },
        label: p.showLabel
          ? {
              show: true,
              position: 'top',
              fontSize: 12,
            }
          : undefined,
      },
    ],
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
.bar-chart {
  width: 100%;
  height: 100%;
}
.echart {
  width: 100%;
  height: 100%;
}
</style>
