<template>
  <div class="vela-status-bar">
    <div class="status-left">
      <span class="status-item">
        <el-icon class="status-icon"><CircleCheck /></el-icon>
        Ready
      </span>
      <el-divider direction="vertical" />
      <span class="status-item breadcrumb">{{ breadcrumb }}</span>
    </div>

    <div class="status-right">
      <span class="status-item">
        <el-icon class="status-icon"><View /></el-icon>
        缩放: {{ zoom }}%
      </span>
      <el-divider direction="vertical" />
      <span class="status-item">
        <el-icon class="status-icon"><Position /></el-icon>
        {{ position }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useComponent } from '@/stores/component'
import { useUIStore } from '@/stores/ui'
import { storeToRefs } from 'pinia'
import { CircleCheck, View, Position } from '@element-plus/icons-vue'

const compStore = useComponent()
const uiStore = useUIStore()
const { canvasScale: scale } = storeToRefs(uiStore)

// 面包屑导航
const breadcrumb = computed(() => {
  const selected = compStore.selectedComponent
  if (!selected) return 'Canvas'

  const buildPath = (comp: any): string => {
    if (!comp) return ''
    const parent = compStore.getComponentById(comp.parentId)
    if (parent) {
      return `${buildPath(parent)} / ${comp.name || comp.type}`
    }
    return comp.name || comp.type
  }

  return `Canvas / ${buildPath(selected)}`
})

// 缩放比例
const zoom = computed(() => Math.round((scale.value || 1) * 100))

// 鼠标位置（占位符）
const position = computed(() => 'X: 0, Y: 0')
</script>

<style scoped>
.vela-status-bar {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  user-select: none;
}

.status-left,
.status-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.status-icon {
  font-size: 14px;
}

.breadcrumb {
  max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: 'Consolas', 'Monaco', monospace;
}

.el-divider--vertical {
  height: 12px;
  margin: 0 4px;
}
</style>
