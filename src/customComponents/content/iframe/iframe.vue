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

// iframe 地址
const iframeUrl = computed(() => {
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
    backgroundColor: String(s.backgroundColor || '#ffffff'),
    borderRadius: `${s.borderRadius || 0}px`,
    overflow: 'hidden',
    border: String(s.border || '1px solid #dcdfe6'),
  }
})

const iframeStyle = computed(() => {
  const s = comp.value?.style || {}
  return {
    width: '100%',
    height: '100%',
    border: 'none',
    opacity: (s.opacity || 100) / 100,
  }
})
</script>

<template>
  <div :style="containerStyle" class="iframe-container">
    <iframe
      v-if="iframeUrl"
      :src="iframeUrl"
      :style="iframeStyle"
      :title="String(comp?.props?.title || 'iframe')"
      :sandbox="comp?.props?.sandbox ? String(comp.props.sandbox) : undefined"
      :allow="comp?.props?.allow ? String(comp.props.allow) : undefined"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
    ></iframe>
    <!-- 遮罩层：防止 iframe 拦截鼠标事件 -->
    <div v-if="iframeUrl" class="iframe-mask"></div>
    <div v-else class="iframe-placeholder">
      <el-icon><Link /></el-icon>
      <span>{{ comp?.props?.placeholder || '请设置 iframe 地址' }}</span>
    </div>
  </div>
</template>

<style scoped>
.iframe-container {
  position: relative;
}

.iframe-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: 1;
  pointer-events: auto;
}

/* 运行时模式下移除遮罩 */
:global(.runtime-mode) .iframe-mask {
  display: none;
}

.iframe-placeholder {
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

.iframe-placeholder .el-icon {
  font-size: 48px;
  color: #c0c4cc;
}
</style>
