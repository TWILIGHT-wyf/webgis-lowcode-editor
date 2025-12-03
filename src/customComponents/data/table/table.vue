<template>
  <BaseTable v-bind="tableProps" @row-click="handleRowClick" />
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import { useComponent } from '@/stores/component'
import { storeToRefs } from 'pinia'
import { vTable as BaseTable, useDataSource, extractWithFallback } from '@twi1i9ht/visual-lib'

const props = defineProps<{ id: string }>()
const { componentStore } = storeToRefs(useComponent())

const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 数据源
const dataSourceRef = toRef(() => comp.value?.dataSource)
const { data: remoteData } = useDataSource(dataSourceRef)

// 表格数据
const tableData = computed(() => {
  const ds = comp.value?.dataSource
  const localData = (comp.value?.props?.data as Record<string, unknown>[]) ?? []

  if (ds?.enabled && remoteData.value) {
    const extracted = extractWithFallback(remoteData.value, ds.dataPath, localData)
    return Array.isArray(extracted) ? extracted : localData
  }

  return localData
})

// 列配置
const columns = computed(() => {
  const cols = comp.value?.props?.columns
  return Array.isArray(cols) ? cols : []
})

// 聚合所有 Props 传递给 Base 组件
const tableProps = computed((): Record<string, unknown> => {
  const s = comp.value?.style || {}
  const p = comp.value?.props || {}
  return {
    // 数据
    data: tableData.value,
    columns: columns.value,
    // 配置项
    stripe: p.stripe ?? true,
    border: p.border ?? true,
    size: p.size ?? 'default',
    autoHeight: p.autoHeight ?? false,
    maxHeight: p.maxHeight,
    highlightCurrentRow: p.highlightCurrentRow ?? true,
    showHeader: p.showHeader ?? true,
    emptyText: p.emptyText ?? '暂无数据',
    // 样式
    opacity: s.opacity ?? 100,
    visible: s.visible !== false,
    headerBackgroundColor: s.headerBackgroundColor ?? '#f5f7fa',
    headerTextColor: s.headerTextColor ?? '#606266',
    headerFontSize: s.headerFontSize ?? 14,
    headerFontWeight: s.headerFontWeight ?? 'bold',
    fontSize: s.fontSize ?? 14,
    textColor: s.textColor ?? '#606266',
    rowBackgroundColor: s.rowBackgroundColor ?? '#ffffff',
  }
})

// 事件
function handleRowClick(row: Record<string, unknown>) {
  console.log('Row clicked:', row)
}
</script>

<style scoped>
/* 样式已内联到 BaseTable */
</style>
