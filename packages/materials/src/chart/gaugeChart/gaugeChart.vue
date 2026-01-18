<template>
  <GaugeChartBase v-bind="chartProps" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useComponent } from '@vela/editor/stores/component'

// 从视觉组件库导入基础组件和工具函数
import {
  gaugeChart as GaugeChartBase,
  useDataSource,
  extractNumberArray,
  extractString,
  parseNumberInput,
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

// 数据适配逻辑 - value
const gaugeValue = computed(() => {
  const ds = comp.value?.dataSource
  const p = comp.value?.props

  if (ds?.enabled && remoteData.value) {
    const extractedValue = extractNumberArray(remoteData.value, ds.dataPath as string)
    if (extractedValue && extractedValue.length > 0 && extractedValue[0] !== undefined) {
      return extractedValue[0]
    }
  }

  // 使用手动输入的数据
  if (p?.value !== undefined) {
    return p.value as number
  }
  if (p?.valueInput) {
    const parsed = parseNumberInput(p.valueInput as string)
    if (parsed.length > 0 && parsed[0] !== undefined) {
      return parsed[0]
    }
  }

  return undefined
})

// 数据适配逻辑 - name
const gaugeName = computed(() => {
  const ds = comp.value?.dataSource
  const p = comp.value?.props

  if (ds?.enabled && remoteData.value) {
    const extractedName = extractString(remoteData.value, ds.namePath as string)
    if (extractedName) return extractedName
  }

  return p?.name as string | undefined
})

// 数据适配逻辑 - min/max
const gaugeMin = computed(() => {
  const ds = comp.value?.dataSource
  const p = comp.value?.props

  if (ds?.enabled && remoteData.value) {
    const extractedMin = extractNumberArray(remoteData.value, ds.minPath as string)
    if (extractedMin && extractedMin.length > 0 && extractedMin[0] !== undefined) {
      return extractedMin[0]
    }
  }

  return p?.min as number | undefined
})

const gaugeMax = computed(() => {
  const ds = comp.value?.dataSource
  const p = comp.value?.props

  if (ds?.enabled && remoteData.value) {
    const extractedMax = extractNumberArray(remoteData.value, ds.maxPath as string)
    if (extractedMax && extractedMax.length > 0 && extractedMax[0] !== undefined) {
      return extractedMax[0]
    }
  }

  return p?.max as number | undefined
})

const customOption = computed(() => {
  const opt = comp.value?.props?.option
  return typeof opt === 'string' ? JSON.parse(opt) : opt
})

// 聚合要透传给库组件的 props
const chartProps = computed((): Record<string, unknown> => {
  const p = comp.value?.props
  return {
    value: gaugeValue.value,
    name: gaugeName.value,
    min: gaugeMin.value,
    max: gaugeMax.value,

    // 样式/选项属性
    title: p?.title,
    startAngle: p?.startAngle,
    endAngle: p?.endAngle,
    splitNumber: p?.splitNumber,
    showProgress: p?.showProgress,
    progressWidth: p?.progressWidth,
    axisLineWidth: p?.axisLineWidth,
    axisLineColor: p?.axisLineColor,
    pointerColor: p?.pointerColor,
    pointerLength: p?.pointerLength,
    pointerWidth: p?.pointerWidth,
    showAxisTick: p?.showAxisTick,
    axisTickSplitNumber: p?.axisTickSplitNumber,
    showSplitLine: p?.showSplitLine,
    splitLineLength: p?.splitLineLength,
    showAxisLabel: p?.showAxisLabel,
    axisLabelDistance: p?.axisLabelDistance,
    axisLabelFontSize: p?.axisLabelFontSize,
    detailFormatter: p?.detailFormatter,
    detailFontSize: p?.detailFontSize,
    detailOffsetX: p?.detailOffsetX,
    detailOffsetY: p?.detailOffsetY,

    // 高级配置覆盖
    option: customOption.value,
  }
})
</script>
