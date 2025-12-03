<template>
  <FunnelChartBase v-bind="chartProps" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useComponent } from '@/stores/component'
import type { Component } from '@/types/components'

// 从视觉组件库导入基础组件和工具函数
import {
  funnelChart as FunnelChartBase,
  useDataSource,
  extractNumberArray,
  extractStringArray,
  parseNumberInput,
  parseStringInput,
} from '@twi1i9ht/visual-lib'

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

  // 默认数据
  const defaultData = [
    { name: '展示', value: 100 },
    { name: '访问', value: 80 },
    { name: '咨询', value: 60 },
    { name: '订单', value: 40 },
    { name: '成交', value: 20 },
  ]

  if (ds?.enabled && remoteData.value) {
    const values = extractNumberArray(remoteData.value, ds.dataPath)
    const labels = extractStringArray(remoteData.value, ds.labelsPath)

    if (values || labels) {
      const finalValues = values || defaultData.map((d) => d.value)
      const finalLabels = labels || finalValues.map((_, idx) => `Stage ${idx + 1}`)
      const len = Math.min(finalValues.length, finalLabels.length)
      return finalLabels.slice(0, len).map((name, idx) => ({
        name,
        value: finalValues[idx] || 0,
      }))
    }
  }

  // 使用手动输入的数据
  if (p?.dataInput && p?.labelsInput) {
    const values = parseNumberInput(p.dataInput as string)
    const labels = parseStringInput(p.labelsInput as string)
    if (values.length > 0 && labels.length > 0) {
      return labels.map((name, idx) => ({
        name,
        value: values[idx] || 0,
      }))
    }
  }

  if (p?.data && Array.isArray(p.data)) {
    return p.data as Array<{ name: string; value: number }>
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
    seriesName: p?.seriesName,
    left: p?.left,
    top: p?.top,
    bottom: p?.bottom,
    width: p?.width,
    min: p?.min,
    max: p?.max,
    minSize: p?.minSize,
    maxSize: p?.maxSize,
    sort: p?.sort,
    gap: p?.gap,
    showLabel: p?.showLabel,
    labelPosition: p?.labelPosition,
    labelFormatter: p?.labelFormatter,
    showLabelLine: p?.showLabelLine,
    labelLineLength: p?.labelLineLength,
    borderColor: p?.borderColor,
    borderWidth: p?.borderWidth,

    // 高级配置覆盖
    option: customOption.value,
  }
})
</script>
