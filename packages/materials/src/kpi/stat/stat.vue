<template>
  <VStat v-bind="statProps" />
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import { useComponent } from '@lowcode/editor/stores/component'
import { storeToRefs } from 'pinia'
import {
  vStat as VStat,
  useDataSource,
  extractWithFallback,
  extractNumber,
} from '@lowcode/ui'

const props = defineProps<{ id: string }>()
const { componentStore } = storeToRefs(useComponent())

const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 数据源
const dataSourceRef = toRef(() => comp.value?.dataSource)
const { data: remoteData } = useDataSource(dataSourceRef)

// 从远程数据或本地props获取值
const displayTitle = computed<string>(() => {
  const ds = comp.value?.dataSource
  const localTitle = (comp.value?.props.title as string) ?? '指标标题'

  if (ds?.enabled && remoteData.value) {
    return extractWithFallback(remoteData.value, ds.titlePath, localTitle) as string
  }
  return localTitle
})

const displayValue = computed<number>(() => {
  try {
    const ds = comp.value?.dataSource
    const localValue = (comp.value?.props.value as number) ?? 0

    if (ds?.enabled && remoteData.value) {
      return extractNumber(remoteData.value, ds.valuePath, localValue)
    }
    return localValue
  } catch (error) {
    console.error('Error in displayValue:', error)
    return 0
  }
})

const displayChange = computed<number>(() => {
  try {
    const ds = comp.value?.dataSource
    const localChange = (comp.value?.props.change as number) ?? 0

    if (ds?.enabled && remoteData.value) {
      return extractNumber(remoteData.value, ds.changePath, localChange)
    }
    return localChange
  } catch (error) {
    console.error('Error in displayChange:', error)
    return 0
  }
})

// 聚合所有 Props 传递给 Dumb 组件
const statProps = computed((): Record<string, unknown> => {
  const s = comp.value?.style || {}
  const p = comp.value?.props || {}
  return {
    // 数据
    title: displayTitle.value,
    value: displayValue.value,
    change: displayChange.value,
    suffix: p.suffix ?? '',
    icon: p.icon ?? 'el-icon-star-on',
    precision: p.precision ?? 0,
    showChange: displayChange.value !== 0,
    // 卡片样式
    opacity: s.opacity ?? 100,
    visible: s.visible !== false,
    backgroundColor: s.backgroundColor ?? '#fff',
    borderColor: s.borderColor ?? '#e0e0e0',
    borderWidth: s.borderWidth ?? 1,
    borderRadius: s.borderRadius ?? 8,
    boxShadow: s.boxShadow ?? '0 2px 4px rgba(0, 0, 0, 0.1)',
    padding: s.padding ?? 20,
    // 标题样式
    titleColor: s.titleColor ?? '#333',
    titleFontSize: s.titleFontSize ?? 14,
    titleFontWeight: s.titleFontWeight ?? 'normal',
    // 数值样式
    valueColor: s.valueColor ?? '#3f8600',
    valueFontSize: s.valueFontSize ?? 24,
    valueFontWeight: s.valueFontWeight ?? 'bold',
    // 变化率样式
    changeFontSize: s.changeFontSize ?? 14,
    changeFontWeight: s.changeFontWeight ?? 'normal',
    changeColorPositive: s.changeColorPositive ?? '#28a745',
    changeColorNegative: s.changeColorNegative ?? '#dc3545',
  }
})
</script>
