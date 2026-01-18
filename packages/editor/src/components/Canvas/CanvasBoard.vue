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
import { storeToRefs } from 'pinia'
import { useUIStore } from '@/stores/ui'
import FreeCanvas from './modes/Free/FreeCanvas.vue'
import FlowCanvas from './modes/Flow/FlowCanvas.vue'

const uiStore = useUIStore()
const { canvasMode } = storeToRefs(uiStore)
</script>

<style scoped>
.canvas-board-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
</style>
