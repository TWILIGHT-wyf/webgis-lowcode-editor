<template>
  <ScatterChartBase v-bind="chartProps" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useComponent } from '@vela/editor/stores/component'
import type { Component } from '@vela/core/types/components'

// 从视觉组件库导入基础组件和工具函数
import {
  scatterChart as ScatterChartBase,
  useDataSource,
  extract2DArray,
  parse2DArrayInput,
} from '@vela/ui'

const props = defineProps<{ id: string }>()

// 获取组件配置
const componentStore = useComponent()
const comp = computed(() => componentStore.componentStore.find((c: Component) => c.id === props.id))

// 获取数据源
const { data: remoteData } = useDataSource(computed(() => comp.value?.dataSource))

// 数据适配逻辑
const chartData = computed(() => {
  const ds = comp.value?.dataSource
  const p = comp.value?.props

  if (ds?.enabled && remoteData.value) {
    const extractedData = extract2DArray(remoteData.value, ds.dataPath)
    if (extractedData && extractedData.length > 0) {
      return extractedData
    }
  }

  // 使用手动输入的数据
  if (p?.dataInput) {
    const parsed = parse2DArrayInput(p.dataInput as string)
    if (parsed.length > 0) {
      return parsed
    }
  }

  if (p?.data && Array.isArray(p.data)) {
    return p.data as Array<[number, number]>
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
    data: chartData.value,

    // 样式/选项属性
    title: p?.title,
    titleAlign: p?.titleAlign,
    titleSize: p?.titleSize,
    titleColor: p?.titleColor,
    seriesName: p?.seriesName,
    symbolSize: p?.symbolSize,
    color: p?.color,
    opacity: p?.opacity,
    showLegend: p?.showLegend,
    legendLeft: p?.legendLeft,
    legendTop: p?.legendTop,
    gridLeft: p?.gridLeft,
    gridRight: p?.gridRight,
    gridBottom: p?.gridBottom,
    gridTop: p?.gridTop,
    xAxisName: p?.xAxisName,
    yAxisName: p?.yAxisName,
    showXAxisSplitLine: p?.showXAxisSplitLine,
    showYAxisSplitLine: p?.showYAxisSplitLine,

    // 高级配置覆盖
    option: customOption.value,
  }
})
</script>
