<template>
  <RadarChartBase v-bind="chartProps" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useComponent } from '@/stores/component'
import type { Component } from '@/types/components'

// 从视觉组件库导入基础组件和工具函数
import {
  radarChart as RadarChartBase,
  useDataSource,
  extractNumberArray,
  extractStringArray,
  parseNumberInput,
  parseStringInput,
  getValueByPath,
} from '@one/visual-lib'

const props = defineProps<{ id: string }>()

// 获取组件配置
const componentStore = useComponent()
const comp = computed(() => componentStore.componentStore.find((c: Component) => c.id === props.id))

// 获取数据源
const { data: remoteData } = useDataSource(computed(() => comp.value?.dataSource))

// 数据适配逻辑 - 指标
const indicators = computed(() => {
  const ds = comp.value?.dataSource
  const p = comp.value?.props

  // 默认指标
  const defaultIndicators = [
    { name: '销售', max: 100 },
    { name: '管理', max: 100 },
    { name: '技术', max: 100 },
    { name: '客服', max: 100 },
    { name: '研发', max: 100 },
    { name: '市场', max: 100 },
  ]

  if (ds?.enabled && remoteData.value) {
    const indicatorNames = extractStringArray(remoteData.value, ds.indicatorNamesPath as string)
    const indicatorMaxs = extractNumberArray(remoteData.value, ds.indicatorMaxsPath as string)

    if (indicatorNames || indicatorMaxs) {
      const names = indicatorNames || defaultIndicators.map((i) => i.name)
      const maxs = indicatorMaxs || defaultIndicators.map((i) => i.max)
      const len = Math.min(names.length, maxs.length)
      return names.slice(0, len).map((name, idx) => ({
        name,
        max: maxs[idx] || 100,
      }))
    }
  }

  // 使用手动输入的数据
  if (p?.indicatorNamesInput) {
    const names = parseStringInput(p.indicatorNamesInput as string)
    if (names.length > 0) {
      const maxs = p.indicatorMaxsInput
        ? parseNumberInput(p.indicatorMaxsInput as string)
        : names.map(() => 100)
      return names.map((name, idx) => ({
        name,
        max: maxs[idx] || 100,
      }))
    }
  }

  return undefined
})

// 数据适配逻辑 - 系列数据
const seriesData = computed(() => {
  const ds = comp.value?.dataSource
  const p = comp.value?.props

  // 默认系列数据
  const defaultSeriesData = [
    { name: '预算', value: [43, 85, 70, 75, 68, 92] },
    { name: '实际开销', value: [50, 90, 60, 82, 73, 85] },
  ]

  if (ds?.enabled && remoteData.value) {
    const seriesNames = extractStringArray(remoteData.value, ds.seriesNamesPath as string)
    const seriesValues =
      remoteData.value && ds.seriesValuesPath
        ? (getValueByPath(remoteData.value, ds.seriesValuesPath as string) as unknown[])
        : undefined

    if (seriesNames && Array.isArray(seriesValues)) {
      return seriesNames.map((name, idx) => ({
        name,
        value: Array.isArray(seriesValues[idx]) ? (seriesValues[idx] as number[]) : [],
      }))
    } else if (Array.isArray(seriesValues)) {
      return seriesValues.map((value, idx) => ({
        name: `Series ${idx + 1}`,
        value: Array.isArray(value) ? (value as number[]) : [],
      }))
    }
  }

  if (p?.seriesData && Array.isArray(p.seriesData)) {
    return p.seriesData as Array<{ name: string; value: number[] }>
  }

  return undefined
})

const customOption = computed(() => {
  const opt = comp.value?.props?.option
  return typeof opt === 'string' ? JSON.parse(opt) : opt
})

// 聚合要透传给库组件的 props
const chartProps = computed((): Record<string, unknown> => {
  const p = comp.value?.props
  return {
    indicators: indicators.value,
    seriesData: seriesData.value,

    // 样式/选项属性
    title: p?.title,
    seriesName: p?.seriesName,
    radarShape: p?.radarShape,
    splitNumber: p?.splitNumber,
    axisNameColor: p?.axisNameColor,
    showArea: p?.showArea,
    areaOpacity: p?.areaOpacity,

    // 高级配置覆盖
    option: customOption.value,
  }
})
</script>
