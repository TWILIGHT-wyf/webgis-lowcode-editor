<template>
  <BaseTimeline v-bind="timelineProps" />
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import { useComponent } from '@lowcode/editor/stores/component'
import { storeToRefs } from 'pinia'
import { vTimeline as BaseTimeline, useDataSource, extractWithFallback } from '@lowcode/ui'

const props = defineProps<{ id: string }>()
const { componentStore } = storeToRefs(useComponent())

const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 数据源
const dataSourceRef = toRef(() => comp.value?.dataSource)
const { data: remoteData } = useDataSource(dataSourceRef)

// 时间轴数据
const timelineData = computed(() => {
  const ds = comp.value?.dataSource
  const localData = (comp.value?.props?.data as Record<string, unknown>[]) ?? []

  if (ds?.enabled && remoteData.value) {
    const extracted = extractWithFallback(remoteData.value, ds.dataPath, localData)
    return Array.isArray(extracted) ? extracted : localData
  }

  return localData
})

// 聚合所有 Props 传递给 Base 组件
const timelineProps = computed((): Record<string, unknown> => {
  const s = comp.value?.style || {}
  const p = comp.value?.props || {}
  return {
    // 数据
    data: timelineData.value,
    // 配置项
    showCard: p.showCard ?? true,
    showTitle: p.showTitle ?? true,
    showTimestamp: p.showTimestamp ?? true,
    showExtra: p.showExtra ?? false,
    timestampPlacement: p.timestampPlacement ?? 'top',
    itemSize: p.itemSize ?? 'normal',
    hollow: p.hollow ?? false,
    cardShadow: p.cardShadow ?? 'hover',
    emptyText: p.emptyText ?? '暂无数据',
    scrollHeight: p.scrollHeight ?? '100%',
    // 样式
    opacity: s.opacity ?? 100,
    visible: s.visible !== false,
    backgroundColor: s.backgroundColor ?? '#ffffff',
    borderRadius: s.borderRadius ?? 4,
    padding: s.padding ?? 16,
    timelinePadding: s.timelinePadding ?? 0,
    cardMargin: s.cardMargin ?? 12,
    cardBorderRadius: s.cardBorderRadius ?? 4,
    headerFontSize: s.headerFontSize ?? 15,
    headerFontWeight: s.headerFontWeight ?? '600',
    headerColor: s.headerColor ?? '#303133',
    titleFontSize: s.titleFontSize ?? 15,
    titleFontWeight: s.titleFontWeight ?? '600',
    titleColor: s.titleColor ?? '#303133',
    contentFontSize: s.contentFontSize ?? 14,
    contentColor: s.contentColor ?? '#606266',
    textFontSize: s.textFontSize ?? 14,
    textColor: s.textColor ?? '#606266',
    extraFontSize: s.extraFontSize ?? 12,
    extraColor: s.extraColor ?? '#909399',
  }
})
</script>

<style scoped>
/* 样式已内联到 BaseTimeline */
</style>
