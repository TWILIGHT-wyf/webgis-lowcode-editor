<script setup lang="ts">
import { computed } from 'vue'
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

// 样式
const containerStyle = computed(() => {
  const s = comp.value?.style || {}
  return {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: String(s.objectFit === 'contain' ? 'center' : 'flex-start'),
    alignItems: String(s.objectFit === 'contain' ? 'center' : 'flex-start'),
    backgroundColor: String(s.backgroundColor || 'transparent'),
    borderRadius: `${s.borderRadius || 0}px`,
    overflow: 'hidden',
    border: String(s.border || 'none'),
  }
})

const imageStyle = computed(() => {
  const s = comp.value?.style || {}
  return {
    width: '100%',
    height: '100%',
    objectFit: String(s.objectFit || 'cover'),
    opacity: (s.opacity || 100) / 100,
  }
})
</script>

<template>
  <div :style="containerStyle">
    <el-image
      v-if="imageUrl"
      :src="imageUrl"
      :style="imageStyle"
      :fit="comp?.props?.fit || 'cover'"
      :lazy="comp?.props?.lazy !== false"
      :preview-src-list="comp?.props?.preview ? [imageUrl] : undefined"
      :z-index="comp?.props?.previewZIndex || 2000"
      :initial-index="0"
      :hide-on-click-modal="comp?.props?.hideOnClickModal !== false"
      :preview-teleported="true"
    >
      <template #error>
        <div class="image-error">
          <el-icon><Picture /></el-icon>
          <span>{{ comp?.props?.errorText || '图片加载失败' }}</span>
        </div>
      </template>
      <template #placeholder>
        <div class="image-loading">
          <el-icon class="is-loading"><Loading /></el-icon>
        </div>
      </template>
    </el-image>
    <div v-else class="image-placeholder">
      <el-icon><Picture /></el-icon>
      <span>{{ comp?.props?.placeholder || '请设置图片地址' }}</span>
    </div>
  </div>
</template>

<style scoped>
.image-error,
.image-loading,
.image-placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: #909399;
  font-size: 14px;
  gap: 8px;
  background-color: #f5f7fa;
}

.image-error .el-icon,
.image-loading .el-icon,
.image-placeholder .el-icon {
  font-size: 48px;
  color: #c0c4cc;
}

.is-loading {
  animation: rotating 2s linear infinite;
}

@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
