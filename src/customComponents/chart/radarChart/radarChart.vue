<template>
  <div class="radar-chart" :style="{ width: '100%', height: '100%' }">
    <v-chart :option="chartOption" autoresize class="echart" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { EChartsOption } from 'echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { RadarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  RadarComponent,
} from 'echarts/components'
import { useComponent } from '@/stores/component'
import type { component } from '@/stores/component'
import { useDataSource } from '@/datasource/useDataSource'
import {
  parseNumberInput,
  parseStringInput,
  extractNumberArray,
  extractStringArray,
} from '../../../datasource/dataUtils'

// 按需引入
use([TitleComponent, TooltipComponent, LegendComponent, RadarComponent, RadarChart, CanvasRenderer])

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

  // 默认雷达图指标
  let indicators = [
    { name: '销售', max: 100 },
    { name: '管理', max: 100 },
    { name: '技术', max: 100 },
    { name: '客服', max: 100 },
    { name: '研发', max: 100 },
    { name: '市场', max: 100 },
  ]

  // 默认数据
  let seriesData = [
    {
      name: '预算',
      value: [43, 85, 70, 75, 68, 92],
    },
    {
      name: '实际开销',
      value: [50, 90, 60, 82, 73, 85],
    },
  ]

  // 如果数据源启用且有数据
  if (ds?.enabled && remoteData.value) {
    // 提取指标名称
    const indicatorNames = extractStringArray(remoteData.value, ds.indicatorNamesPath as string)
    // 提取指标最大值
    const indicatorMaxs = extractNumberArray(remoteData.value, ds.indicatorMaxsPath as string)

    if (indicatorNames || indicatorMaxs) {
      const names = indicatorNames || indicators.map((i) => i.name)
      const maxs = indicatorMaxs || indicators.map((i) => i.max)
      const len = Math.min(names.length, maxs.length)
      indicators = names.slice(0, len).map((name, idx) => ({
        name,
        max: maxs[idx] || 100,
      }))
    }

    // 提取系列名称
    const seriesNames = extractStringArray(remoteData.value, ds.seriesNamesPath as string)
    // 提取系列数据（二维数组）
    const seriesValues =
      remoteData.value && ds.seriesValuesPath
        ? (remoteData.value as Record<string, unknown>)[ds.seriesValuesPath as string]
        : undefined

    if (seriesNames && Array.isArray(seriesValues)) {
      seriesData = seriesNames.map((name, idx) => ({
        name,
        value: Array.isArray(seriesValues[idx]) ? seriesValues[idx] : [],
      }))
    } else if (Array.isArray(seriesValues)) {
      seriesData = seriesValues.map((value, idx) => ({
        name: `Series ${idx + 1}`,
        value: Array.isArray(value) ? value : [],
      }))
    }
  } else {
    // 使用手动输入的数据
    if (p.indicatorNamesInput) {
      const names = parseStringInput(p.indicatorNamesInput as string, [])
      if (names.length > 0) {
        const maxs = p.indicatorMaxsInput
          ? parseNumberInput(p.indicatorMaxsInput as string, [])
          : names.map(() => 100)
        indicators = names.map((name, idx) => ({
          name,
          max: maxs[idx] || 100,
        }))
      }
    }

    if (p.seriesData && Array.isArray(p.seriesData)) {
      seriesData = p.seriesData as Array<{ name: string; value: number[] }>
    }
  }

  const option: EChartsOption = {
    title: {
      text: (p.title as string) || '',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      bottom: 10,
      data: seriesData.map((s) => s.name),
    },
    radar: {
      indicator: indicators,
      shape: (p.radarShape as 'polygon' | 'circle') || 'polygon',
      splitNumber: (p.splitNumber as number) || 5,
      axisName: {
        color: (p.axisNameColor as string) || '#333',
      },
    },
    series: [
      {
        name: (p.seriesName as string) || 'Radar',
        type: 'radar',
        data: seriesData,
        areaStyle: p.showArea
          ? {
              opacity: (p.areaOpacity as number) || 0.3,
            }
          : undefined,
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
.radar-chart {
  width: 100%;
  height: 100%;
}
.echart {
  width: 100%;
  height: 100%;
}
</style>
