<template>
  <BaseImage v-bind="imageProps" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useComponent } from '@/stores/component'
import { vImage as BaseImage, useDataSource, extractWithFallback } from '@one/visual-lib'

const props = defineProps<{
  id: string
}>()

const { componentStore } = storeToRefs(useComponent())

const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 数据源
const dataSourceRef = computed(() => comp.value?.dataSource)
const { data: dataSourceData } = useDataSource(dataSourceRef)

// 图片地址
const imageUrl = computed(() => {
  // 优先使用数据源
  if (dataSourceData.value) {
    const urlField: string = (comp.value?.dataSource?.urlField as string) || 'url'
    return extractWithFallback<string>(dataSourceData.value, urlField, '')
  }
  // 使用 props 中的 url
  return String(comp.value?.props?.url || '')
})

// 聚合 props
const imageProps = computed(() => {
  const p = comp.value?.props || {}
  const s = comp.value?.style || {}

  return {
    url: imageUrl.value,
    fit: (p.fit as 'fill' | 'contain' | 'cover' | 'none' | 'scale-down') || 'cover',
    lazy: p.lazy !== false,
    preview: p.preview === true,
    previewZIndex: (p.previewZIndex as number) || 2000,
    hideOnClickModal: p.hideOnClickModal !== false,
    placeholder: (p.placeholder as string) || '请设置图片地址',
    errorText: (p.errorText as string) || '图片加载失败',
    backgroundColor: s.backgroundColor || 'transparent',
    borderRadius: s.borderRadius || 0,
    border: s.border || 'none',
    objectFit: s.objectFit || 'cover',
    opacity: s.opacity || 100,
  }
})
</script>
