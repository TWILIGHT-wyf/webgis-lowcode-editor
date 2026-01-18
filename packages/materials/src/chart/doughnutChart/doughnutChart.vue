<template>
  <DoughnutChartBase v-bind="chartProps" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useComponent } from '@vela/editor/stores/component'

// 从视觉组件库导入基础组件和工具函数
import {
  doughnutChart as DoughnutChartBase,
  useDataSource,
  extractNumberArray,
  extractStringArray,
  parseNumberInput,
  parseStringInput,
} from '@vela/ui'

const props = defineProps<{ id: string }>()

// 获取组件配置
const componentStore = useComponent()
const { rootNode } = storeToRefs(componentStore)
const comp = computed(() => {
  if (!rootNode.value) return null
  return componentStore.findNodeById(rootNode.value, props.id)
})

// 获取数据源
const { data: remoteData } = useDataSource(computed(() => comp.value?.dataSource))

// 数据适配逻辑
const chartData = computed(() => {
  const ds = comp.value?.dataSource
  const p = comp.value?.props

  // 默认数据
  const defaultData = [
    { name: 'Direct', value: 335 },
    { name: 'Email', value: 310 },
    { name: 'Union Ads', value: 234 },
    { name: 'Video Ads', value: 135 },
    { name: 'Search Engine', value: 1548 },
  ]

  if (ds?.enabled && remoteData.value) {
    const values = extractNumberArray(remoteData.value, ds.dataPath)
    const labels = extractStringArray(remoteData.value, ds.labelsPath)

    if (values || labels) {
      const finalValues = values || defaultData.map((d) => d.value)
      const finalLabels = labels || finalValues.map((_, idx) => `Category ${idx + 1}`)
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
    titleAlign: p?.titleAlign,
    titleSize: p?.titleSize,
    titleColor: p?.titleColor,
    seriesName: p?.seriesName,
    innerRadius: p?.innerRadius,
    outerRadius: p?.outerRadius,
    centerX: p?.centerX,
    centerY: p?.centerY,
    borderRadius: p?.borderRadius,
    borderColor: p?.borderColor,
    borderWidth: p?.borderWidth,
    showLegend: p?.showLegend,
    legendOrient: p?.legendOrient,
    legendLeft: p?.legendLeft,
    legendTop: p?.legendTop,
    showLabel: p?.showLabel,
    labelFormatter: p?.labelFormatter,
    showLabelLine: p?.showLabelLine,

    // 高级配置覆盖
    option: customOption.value,
  }
})
</script>
