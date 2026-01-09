<template>
  <StackedBarChartBase v-bind="chartProps" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useComponent } from '@/stores/component'

// 从视觉组件库导入基础组件和工具函数
import {
  stackedBarChart as StackedBarChartBase,
  useDataSource,
  extractStringArray,
  parseNumberInput,
  parseStringInput,
  getValueByPath,
} from '@twi1i9ht/visual-lib'

const props = defineProps<{ id: string }>()

// 获取组件配置
const { componentStore } = storeToRefs(useComponent())
const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 获取数据源
const { data: remoteData } = useDataSource(computed(() => comp.value?.dataSource))

// 默认值
const defaultSeriesData = [
  [120, 132, 101, 134, 90, 230, 210],
  [220, 182, 191, 234, 290, 330, 310],
  [150, 232, 201, 154, 190, 330, 410],
]

// 数据适配逻辑 - xAxisData
const xAxisData = computed(() => {
  const ds = comp.value?.dataSource
  const p = comp.value?.props

  if (ds?.enabled && remoteData.value) {
    const extractedXAxis = extractStringArray(remoteData.value, ds.xAxisPath)
    if (extractedXAxis) return extractedXAxis
  }

  if (p?.xAxisInput) {
    return parseStringInput(p.xAxisInput as string)
  }
  if (p?.xAxisData) {
    return p.xAxisData as string[]
  }

  return undefined
})

// 数据适配逻辑 - seriesNames
const seriesNames = computed(() => {
  const ds = comp.value?.dataSource
  const p = comp.value?.props

  if (ds?.enabled && remoteData.value) {
    const extractedNames = extractStringArray(remoteData.value, ds.seriesNamesPath)
    if (extractedNames) return extractedNames
  }

  if (p?.seriesNamesInput) {
    return parseStringInput(p.seriesNamesInput as string)
  }
  if (p?.seriesNames) {
    return p.seriesNames as string[]
  }

  return undefined
})

// 数据适配逻辑 - seriesData
const seriesData = computed(() => {
  const ds = comp.value?.dataSource
  const p = comp.value?.props

  if (ds?.enabled && remoteData.value && ds.seriesDataPath) {
    const extractedData = getValueByPath(remoteData.value, ds.seriesDataPath)
    if (Array.isArray(extractedData)) {
      return extractedData.map((series) => {
        if (Array.isArray(series)) {
          return series.map((v) => (typeof v === 'number' ? v : parseFloat(String(v))))
        }
        return []
      })
    }
  }

  // 使用各个系列的单独输入
  const result: number[][] = [...defaultSeriesData]
  if (p?.series1Input) {
    result[0] = parseNumberInput(p.series1Input as string)
  }
  if (p?.series2Input) {
    result[1] = parseNumberInput(p.series2Input as string)
  }
  if (p?.series3Input) {
    result[2] = parseNumberInput(p.series3Input as string)
  }

  if (p?.seriesData && Array.isArray(p.seriesData)) {
    return p.seriesData as number[][]
  }

  // 检查是否有任何变化
  if (p?.series1Input || p?.series2Input || p?.series3Input) {
    return result
  }

  return undefined
})

// 颜色配置
const colors = computed(() => {
  const p = comp.value?.props
  const result: string[] = []
  if (p?.color1) result.push(p.color1 as string)
  else result.push('#5470c6')
  if (p?.color2) result.push(p.color2 as string)
  else result.push('#91cc75')
  if (p?.color3) result.push(p.color3 as string)
  else result.push('#fac858')
  return result
})

const customOption = computed(() => {
  const opt = comp.value?.props?.option
  return typeof opt === 'string' ? JSON.parse(opt) : opt
})

// 聚合要透传给库组件的 props
const chartProps = computed((): Record<string, unknown> => {
  const p = comp.value?.props
  return {
    xAxisData: xAxisData.value,
    seriesNames: seriesNames.value,
    seriesData: seriesData.value,
    colors: colors.value,

    // 样式/选项属性
    title: p?.title,
    barWidth: p?.barWidth,
    borderRadius: p?.borderRadius,
    showTooltip: p?.showTooltip,
    showLegend: p?.showLegend,
    legendPosition: p?.legendPosition,
    showGrid: p?.showGrid,
    xAxisName: p?.xAxisName,
    yAxisName: p?.yAxisName,
    showXAxisLine: p?.showXAxisLine,
    showXAxisLabel: p?.showXAxisLabel,
    showYAxisLine: p?.showYAxisLine,
    showYAxisLabel: p?.showYAxisLabel,
    showLabel: p?.showLabel,

    // 高级配置覆盖
    option: customOption.value,
  }
})
</script>
