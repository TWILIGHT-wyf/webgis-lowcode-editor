<template>
  <div class="resize-handle" :class="`resize-handle--${position}`" @mousedown="handleMouseDown">
    <div class="resize-handle__line"></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  position: 'left' | 'right'
}>()

const emit = defineEmits<{
  'resize-start': []
  'resize-end': []
}>()

function handleMouseDown(e: MouseEvent) {
  e.preventDefault()
  emit('resize-start')

  // 添加全局鼠标样式
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
}
</script>

<style scoped>
.resize-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 4px;
  cursor: col-resize;
  z-index: 10;
  transition: background-color 0.2s;
}

.resize-handle--left {
  right: 0;
}

.resize-handle--right {
  left: 0;
}

.resize-handle__line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  background-color: transparent;
  transition: all 0.2s;
}

.resize-handle:hover {
  background-color: rgba(var(--el-color-primary-rgb), 0.1);
}

.resize-handle:hover .resize-handle__line {
  width: 2px;
  background-color: var(--el-color-primary);
}

.resize-handle:active {
  background-color: rgba(var(--el-color-primary-rgb), 0.15);
}

/* 拖拽时的视觉反馈 */
.resize-handle:active .resize-handle__line {
  background-color: var(--el-color-primary);
  box-shadow: 0 0 4px var(--el-color-primary);
}
</style>
