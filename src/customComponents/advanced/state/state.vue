<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useComponent } from '@/stores/component'
import { vState as BaseState, useDataSource, extractWithFallback } from '@twi1i9ht/visual-lib'

const props = defineProps<{
  id: string
}>()

const { componentStore } = storeToRefs(useComponent())

const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 数据源
const dataSourceRef = computed(() => comp.value?.dataSource)
const { data: dataSourceData } = useDataSource(dataSourceRef)

// 状态数据
const stateData = computed(() => {
  // 优先使用数据源
  if (dataSourceData.value) {
    const stateField: string = (comp.value?.dataSource?.stateField as string) || 'state'
    return extractWithFallback<Record<string, unknown>>(dataSourceData.value, stateField, {})
  }
  // 使用 props 中的 state
  const stateStr = String(comp.value?.props?.state || '{}')
  try {
    return JSON.parse(stateStr) as Record<string, unknown>
  } catch {
    return {}
  }
})

// 聚合属性
const componentProps = computed(() => {
  const p = comp.value?.props || {}
  const s = comp.value?.style || {}

  return {
    title: String(p.title || '状态管理器'),
    stateData: stateData.value,
    viewMode: (p.viewMode as 'list' | 'json' | 'table') || 'list',
    placeholder: String(p.placeholder || '暂无状态数据'),
    // 样式
    padding: Number(s.padding || 16),
    backgroundColor: String(s.backgroundColor || '#2d2d2d'),
    textColor: String(s.textColor || '#cccccc'),
    fontSize: Number(s.fontSize || 14),
    lineHeight: Number(s.lineHeight || 1.6),
    borderRadius: Number(s.borderRadius || 4),
    border: String(s.border || '1px solid #3c3c3c'),
    fontFamily: String(s.fontFamily || 'Consolas, Monaco, "Courier New", monospace'),
  }
})
</script>

<template>
  <BaseState v-bind="componentProps" />
</template>
