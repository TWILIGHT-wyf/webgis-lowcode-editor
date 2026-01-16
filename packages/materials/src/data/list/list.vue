<template>
  <BaseList v-bind="listProps" @item-click="handleItemClick" />
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import { useComponent } from '@lowcode/editor/stores/component'
import { storeToRefs } from 'pinia'
import { vList as BaseList, useDataSource, extractWithFallback } from '@lowcode/ui'

const props = defineProps<{ id: string }>()
const { componentStore } = storeToRefs(useComponent())

const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 数据源
const dataSourceRef = toRef(() => comp.value?.dataSource)
const { data: remoteData } = useDataSource(dataSourceRef)

// 列表数据
const listData = computed(() => {
  const ds = comp.value?.dataSource
  const localData = (comp.value?.props?.data as Record<string, unknown>[]) ?? []

  if (ds?.enabled && remoteData.value) {
    const extracted = extractWithFallback(remoteData.value, ds.dataPath, localData)
    return Array.isArray(extracted) ? extracted : localData
  }

  return localData
})

// 聚合所有 Props 传递给 Base 组件
const listProps = computed((): Record<string, unknown> => {
  const s = comp.value?.style || {}
  const p = comp.value?.props || {}
  return {
    // 数据
    data: listData.value,
    // 字段映射
    titleField: p.titleField ?? 'title',
    descriptionField: p.descriptionField ?? 'description',
    extraField: p.extraField ?? 'extra',
    // 配置项
    showIcon: p.showIcon ?? false,
    showTitle: p.showTitle ?? true,
    showDescription: p.showDescription ?? true,
    showExtra: p.showExtra ?? false,
    showAction: p.showAction ?? true,
    showBorder: p.showBorder ?? true,
    showSplit: p.showSplit ?? true,
    emptyText: p.emptyText ?? '暂无数据',
    iconSize: p.iconSize ?? 20,
    scrollHeight: p.scrollHeight ?? '100%',
    // 样式
    opacity: s.opacity ?? 100,
    visible: s.visible !== false,
    backgroundColor: s.backgroundColor ?? '#ffffff',
    borderRadius: s.borderRadius ?? 4,
    itemPadding: s.itemPadding ?? 12,
    itemPaddingX: s.itemPaddingX ?? 16,
    itemBackgroundColor: s.itemBackgroundColor ?? '#ffffff',
    splitColor: s.splitColor ?? '#e4e7ed',
    borderColor: s.borderColor ?? 'transparent',
    iconColor: s.iconColor ?? '#909399',
    titleFontSize: s.titleFontSize ?? 15,
    titleColor: s.titleColor ?? '#303133',
    titleFontWeight: s.titleFontWeight ?? '500',
    descriptionFontSize: s.descriptionFontSize ?? 13,
    descriptionColor: s.descriptionColor ?? '#909399',
    extraFontSize: s.extraFontSize ?? 12,
    extraColor: s.extraColor ?? '#409eff',
  }
})

// 事件
function handleItemClick(item: Record<string, unknown>, index: number) {
  console.log('Item clicked:', item, index)
}
</script>

<style scoped>
/* 样式已内联到 BaseList */
</style>
