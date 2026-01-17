<template>
  <div v-if="isReady" style="width: 100%; height: 100%; overflow: hidden">
    <BarChartBase v-bind="chartProps" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useComponent } from '@vela/editor/stores/component'

// 从视觉组件库导入基础组件和工具函数
import {
  barChart as BarChartBase,
  useDataSource,
  extractNumberArray,
  extractStringArray,
  extractString,
  parseNumberInput,
  parseStringInput,
} from '@vela/ui'

const props = defineProps<{ id: string }>()
const isReady = ref(false) // 控制渲染时机

// 等待挂载后，再下一帧渲染 ECharts
onMounted(() => {
  nextTick(() => {
    // 简单的延时以确保容器已有尺寸（处理 SplitPane 或 Tabs 的情况）
    setTimeout(() => {
      isReady.value = true
    }, 50)
  })
})

// 获取组件配置
const { componentStore } = storeToRefs(useComponent())
const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 获取数据源
const { data: remoteData } = useDataSource(computed(() => comp.value?.dataSource))

// 数据适配逻辑
const chartData = computed(() => {
  const ds = comp.value?.dataSource
  const p = comp.value?.props

  if (ds?.enabled && remoteData.value) {
    return extractNumberArray(remoteData.value, ds.dataPath) || []
  }

  if (p?.dataInput) return parseNumberInput(p.dataInput as string)
  return p?.data as number[]
})

const xAxisData = computed(() => {
  const ds = comp.value?.dataSource
  const p = comp.value?.props

  if (ds?.enabled && remoteData.value) {
    return extractStringArray(remoteData.value, ds.xAxisPath) || []
  }
  if (p?.xAxisInput) return parseStringInput(p.xAxisInput as string)
  return p?.xAxisData as string[]
})

const seriesName = computed(() => {
  const ds = comp.value?.dataSource
  const p = comp.value?.props

  if (ds?.enabled && remoteData.value) {
    return extractString(remoteData.value, ds.seriesNamePath)
  }
  return p?.seriesName as string
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
    xAxisData: xAxisData.value,
    seriesName: seriesName.value,

    // 样式/选项属性
    title: p?.title,
    barColor: p?.barColor,
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
