<template>
  <div class="canvas-board-wrapper">
    <!-- Free 模式画布 (绝对定位 + Snap/Shape) -->
    <FreeCanvas v-if="canvasMode === 'free'" />

    <!-- Flow 模式画布 (文档流) -->
    <FlowCanvas v-else-if="canvasMode === 'flow'" />

    <!-- 兜底模式 (使用 Free 模式) -->
    <FreeCanvas v-else />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useProjectStore } from '@/stores/project'
import FreeCanvas from './modes/Free/FreeCanvas.vue'
import FlowCanvas from './modes/Flow/FlowCanvas.vue'

const projectStore = useProjectStore()
const { activePage } = storeToRefs(projectStore)

/**
 * 画布模式：从当前页面配置中读取
 * - 'free': 自由画布模式 (默认，绝对定位，支持 Snap/Shape/ContextMenu)
 * - 'flow': 流式画布模式 (文档流，简化选中交互)
 */
const canvasMode = computed(() => {
  return (activePage.value?.canvasSettings?.layout as 'free' | 'flow') || 'free'
})
</script>

<style scoped>
.canvas-board-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
</style>
