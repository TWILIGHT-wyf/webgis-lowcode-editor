<template>
  <BasePivot v-bind="pivotProps" />
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import { useComponent } from '@lowcode/editor/stores/component'
import { storeToRefs } from 'pinia'
import { vPivot as BasePivot, useDataSource, extractWithFallback } from '@lowcode/ui'

const props = defineProps<{ id: string }>()
const { componentStore } = storeToRefs(useComponent())

const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 数据源
const dataSourceRef = toRef(() => comp.value?.dataSource)
const { data: remoteData } = useDataSource(dataSourceRef)

// 透视表数据
const pivotData = computed(() => {
  const ds = comp.value?.dataSource
  const localData = (comp.value?.props?.data as Record<string, unknown>[]) ?? []

  if (ds?.enabled && remoteData.value) {
    const extracted = extractWithFallback(remoteData.value, ds.dataPath, localData)
    return Array.isArray(extracted) ? extracted : localData
  }

  return localData
})

// 聚合所有 Props 传递给 Base 组件
const pivotProps = computed((): Record<string, unknown> => {
  const s = comp.value?.style || {}
  const p = comp.value?.props || {}
  return {
    // 数据
    data: pivotData.value,
    // 配置项
    rowHeaders: p.rowHeaders ?? ['category', 'region'],
    dataColumns: p.dataColumns ?? [],
    columnLabels: p.columnLabels ?? {},
    stripe: p.stripe ?? true,
    border: p.border ?? true,
    size: p.size ?? 'default',
    showSummary: p.showSummary ?? true,
    emptyText: p.emptyText ?? '暂无数据',
    height: p.height ?? 'auto',
    maxHeight: p.maxHeight ?? '',
    rowHeaderWidth: p.rowHeaderWidth ?? 120,
    fixedRowHeaders: p.fixedRowHeaders ?? true,
    rowHeaderAlign: p.rowHeaderAlign ?? 'left',
    valueFormat: p.valueFormat ?? 'number',
    highlightThreshold: p.highlightThreshold ?? 0,
    // 样式
    opacity: s.opacity ?? 100,
    visible: s.visible !== false,
    backgroundColor: s.backgroundColor ?? '#ffffff',
    borderRadius: s.borderRadius ?? 4,
    padding: s.padding ?? 0,
    headerBackgroundColor: s.headerBackgroundColor ?? '#f5f7fa',
    headerColor: s.headerColor ?? '#909399',
    hoverBackgroundColor: s.hoverBackgroundColor ?? '#f5f7fa',
    borderColor: s.borderColor ?? '#ebeef5',
    highlightColor: s.highlightColor ?? '#67c23a',
  }
})
</script>

<style scoped>
/* 样式已内联到 BasePivot */
</style>
