<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useComponent } from '@/stores/component'
import { useDataSource } from '@/datasource/useDataSource'
import { extractWithFallback } from '@/datasource/dataUtils'

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

const videoRef = ref<HTMLVideoElement>()

// 样式
const containerStyle = computed(() => {
  const s = comp.value?.style || {}
  return {
    width: '100%',
    height: '100%',
    backgroundColor: String(s.backgroundColor || '#000000'),
    borderRadius: `${s.borderRadius || 0}px`,
    overflow: 'hidden',
    border: String(s.border || 'none'),
  }
})

const videoStyle = computed(() => {
  const s = comp.value?.style || {}
  return {
    width: '100%',
    height: '100%',
    objectFit: (s.objectFit || 'contain') as 'fill' | 'contain' | 'cover' | 'none',
    opacity: (s.opacity || 100) / 100,
  }
})
</script>

<template>
  <div :style="containerStyle">
    <video
      v-if="videoUrl"
      ref="videoRef"
      :src="videoUrl"
      :poster="posterUrl"
      :style="videoStyle"
      :controls="comp?.props?.controls !== false"
      :autoplay="comp?.props?.autoplay === true"
      :loop="comp?.props?.loop === true"
      :muted="comp?.props?.muted === true"
      :preload="String(comp?.props?.preload || 'metadata')"
      :playsinline="true"
      :controlslist="comp?.props?.noDownload ? 'nodownload' : undefined"
      :disablepictureinpicture="comp?.props?.noPictureInPicture === true"
    >
      您的浏览器不支持视频播放
    </video>
    <div v-else class="video-placeholder">
      <el-icon><VideoPlay /></el-icon>
      <span>{{ comp?.props?.placeholder || '请设置视频地址' }}</span>
    </div>
  </div>
</template>

<style scoped>
.video-placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: #909399;
  font-size: 14px;
  gap: 8px;
  background-color: #000000;
}

.video-placeholder .el-icon {
  font-size: 64px;
  color: #606266;
}
</style>
