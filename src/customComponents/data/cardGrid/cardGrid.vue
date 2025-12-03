<template>
  <BaseCardGrid v-bind="cardGridProps" @card-click="handleCardClick" />
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import { useComponent } from '@/stores/component'
import { storeToRefs } from 'pinia'
import { vCardGrid as BaseCardGrid, useDataSource, extractWithFallback } from '@one/visual-lib'

const props = defineProps<{ id: string }>()
const { componentStore } = storeToRefs(useComponent())

const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 数据源
const dataSourceRef = toRef(() => comp.value?.dataSource)
const { data: remoteData } = useDataSource(dataSourceRef)

// 卡片数据
const cardData = computed(() => {
  const ds = comp.value?.dataSource
  const localData = (comp.value?.props?.data as Record<string, unknown>[]) ?? []

  if (ds?.enabled && remoteData.value) {
    const extracted = extractWithFallback(remoteData.value, ds.dataPath, localData)
    return Array.isArray(extracted) ? extracted : localData
  }

  return localData
})

// 聚合所有 Props 传递给 Base 组件
const cardGridProps = computed((): Record<string, unknown> => {
  const s = comp.value?.style || {}
  const p = comp.value?.props || {}
  return {
    // 数据
    data: cardData.value,
    // 字段映射
    titleField: p.titleField ?? 'title',
    descriptionField: p.descriptionField ?? 'description',
    footerField: p.footerField ?? 'footer',
    tagsField: p.tagsField ?? 'tags',
    imageField: p.imageField ?? 'image',
    // 配置项
    showImage: p.showImage ?? false,
    showTitle: p.showTitle ?? true,
    showDescription: p.showDescription ?? true,
    showTags: p.showTags ?? false,
    showFooter: p.showFooter ?? false,
    cardShadow: p.cardShadow ?? 'hover',
    tagSize: p.tagSize ?? 'small',
    emptyText: p.emptyText ?? '暂无数据',
    scrollHeight: p.scrollHeight ?? '100%',
    columns: p.columns ?? 3,
    gap: p.gap ?? 16,
    // 样式
    opacity: s.opacity ?? 100,
    visible: s.visible !== false,
    backgroundColor: s.backgroundColor ?? '#f5f7fa',
    borderRadius: s.borderRadius ?? 4,
    padding: s.padding ?? 16,
    cardBorderRadius: s.cardBorderRadius ?? 4,
    cardPadding: s.cardPadding ?? 14,
    imageHeight: s.imageHeight ?? 150,
    imageBorderRadius: s.imageBorderRadius ?? 4,
    titleFontSize: s.titleFontSize ?? 16,
    titleColor: s.titleColor ?? '#303133',
    titleFontWeight: s.titleFontWeight ?? '600',
    descriptionFontSize: s.descriptionFontSize ?? 13,
    descriptionColor: s.descriptionColor ?? '#606266',
    footerFontSize: s.footerFontSize ?? 12,
    footerColor: s.footerColor ?? '#909399',
    footerBorderColor: s.footerBorderColor ?? '#ebeef5',
  }
})

// 事件
function handleCardClick(item: Record<string, unknown>, index: number) {
  console.log('Card clicked:', item, index)
}
</script>

<style scoped>
/* 样式已内联到 BaseCardGrid */
</style>
