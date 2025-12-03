<template>
  <BaseVideo v-bind="videoProps" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useComponent } from '@/stores/component'
import { vVideo as BaseVideo, useDataSource, extractWithFallback } from '@one/visual-lib'

const props = defineProps<{
  id: string
}>()

const { componentStore } = storeToRefs(useComponent())

const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 数据源
const dataSourceRef = computed(() => comp.value?.dataSource)
const { data: dataSourceData } = useDataSource(dataSourceRef)

// 视频地址
const videoUrl = computed(() => {
  // 优先使用数据源
  if (dataSourceData.value) {
    const urlField: string = (comp.value?.dataSource?.urlField as string) || 'url'
    return extractWithFallback<string>(dataSourceData.value, urlField, '')
  }
  // 使用 props 中的 url
  return String(comp.value?.props?.url || '')
})

// 海报地址
const posterUrl = computed(() => {
  if (dataSourceData.value) {
    const posterField: string = (comp.value?.dataSource?.posterField as string) || 'poster'
    return extractWithFallback<string>(dataSourceData.value, posterField, '')
  }
  return String(comp.value?.props?.poster || '')
})

// 聚合 props
const videoProps = computed(() => {
  const p = comp.value?.props || {}
  const s = comp.value?.style || {}

  return {
    url: videoUrl.value,
    poster: posterUrl.value,
    controls: p.controls !== false,
    autoplay: p.autoplay === true,
    loop: p.loop === true,
    muted: p.muted === true,
    preload: (p.preload as 'none' | 'metadata' | 'auto') || 'metadata',
    noDownload: p.noDownload === true,
    noPictureInPicture: p.noPictureInPicture === true,
    placeholder: (p.placeholder as string) || '请设置视频地址',
    backgroundColor: s.backgroundColor || '#000000',
    borderRadius: s.borderRadius || 0,
    border: s.border || 'none',
    objectFit: (s.objectFit as 'fill' | 'contain' | 'cover' | 'none') || 'contain',
    opacity: s.opacity || 100,
  }
})
</script>
