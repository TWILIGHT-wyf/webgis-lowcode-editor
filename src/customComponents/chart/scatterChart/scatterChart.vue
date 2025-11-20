<template>
  <div class="scatter-chart" :style="{ width: '100%', height: '100%' }">
    <v-chart :option="chartOption" autoresize class="echart" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { EChartsOption } from 'echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { ScatterChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components'
import { useComponent } from '@/stores/component'
import type { component } from '@/stores/component'
import { useDataSource } from '@/datasource/useDataSource'
import { parse2DArrayInput, extract2DArray } from '../chartUtils'

// 按需引入
use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ScatterChart,
  CanvasRenderer,
])

const props = defineProps<{
  id: string
}>()

const componentStore = useComponent()
const comp = computed(() => componentStore.componentStore.find((c: component) => c.id === props.id))

// 使用数据源 hook
const { data: remoteData } = useDataSource(computed(() => comp.value?.dataSource))

const chartOption = ref<EChartsOption>({})

function buildOption(): EChartsOption {
  const p = comp.value?.props || {}
  const ds = comp.value?.dataSource

  // 默认数据
  let data: Array<[number, number]> = [
    [10.0, 8.04],
    [8.07, 6.95],
    [13.0, 7.58],
    [9.05, 8.81],
    [11.0, 8.33],
    [14.0, 7.66],
    [13.4, 6.81],
    [10.0, 6.33],
    [14.0, 8.96],
    [12.5, 6.82],
  ]

  // 如果数据源启用且有数据，优先使用数据源
  if (ds?.enabled && remoteData.value) {
    const extractedData = extract2DArray(remoteData.value, ds.dataPath)
    if (extractedData && extractedData.length > 0) {
      data = extractedData
    }
  } else {
    // 使用手动输入的数据
    if (p.dataInput) {
      const parsed = parse2DArrayInput(p.dataInput as string, [])
      if (parsed.length > 0) {
        data = parsed
      }
    } else if (p.data && Array.isArray(p.data)) {
      data = p.data as Array<[number, number]>
    }
  }

  const option: EChartsOption = {
    title: {
      text: (p.title as string) || '',
      left: (p.titleAlign as string) || 'center',
      textStyle: {
        fontSize: (p.titleSize as number) || 16,
        color: (p.titleColor as string) || '#333',
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: unknown) => {
        const p = params as { seriesName: string; value: [number, number] }
        return `${p.seriesName}<br/>${p.value[0]}, ${p.value[1]}`
      },
    },
    legend: {
      show: (p.showLegend as boolean) !== false,
      left: (p.legendLeft as string) || 'center',
      top: (p.legendTop as string) || 'bottom',
    },
    grid: {
      left: (p.gridLeft as string) || '10%',
      right: (p.gridRight as string) || '10%',
      bottom: (p.gridBottom as string) || '15%',
      top: (p.gridTop as string) || '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      name: (p.xAxisName as string) || '',
      nameLocation: 'middle',
      nameGap: 30,
      splitLine: {
        show: (p.showXAxisSplitLine as boolean) !== false,
      },
    },
    yAxis: {
      type: 'value',
      name: (p.yAxisName as string) || '',
      nameLocation: 'middle',
      nameGap: 40,
      splitLine: {
        show: (p.showYAxisSplitLine as boolean) !== false,
      },
    },
    series: [
      {
        name: (p.seriesName as string) || 'Data',
        type: 'scatter',
        symbolSize: (p.symbolSize as number) || 10,
        data: data,
        itemStyle: {
          color: (p.color as string) || '#5470c6',
          opacity: (p.opacity as number) || 0.8,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }

  return option
}

// 监听组件属性、数据源变化
watch(
  [() => comp.value?.props, () => comp.value?.dataSource, remoteData],
  () => {
    chartOption.value = buildOption()
  },
  { deep: true, immediate: true },
)
</script>

<style scoped>
div {
  width: 100%;
  height: 100%;
}
</style>
