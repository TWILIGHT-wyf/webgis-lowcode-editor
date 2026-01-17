<template>
  <div
    class="canvas-board"
    @click="handleBoardClick"
    @dragover.prevent
    @drop="handleDrop"
    data-testid="canvas-board-v2"
  >
    <div class="canvas-container">
      <RecursiveRenderer v-if="currentTree" :node="currentTree" class="canvas-content" />

      <!-- 空状态提示 -->
      <div v-if="!currentTree.children || currentTree.children.length === 0" class="empty-state">
        <div class="empty-icon">📦</div>
        <p>从左侧拖拽组件到此处开始搭建</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { RecursiveRenderer } from '@lowcode/renderer'
import { useComponentStoreV2 } from '@/stores/componentV2'

const compStore = useComponentStoreV2()
const { currentTree, selectedId } = storeToRefs(compStore)
const { addComponent, setSelected } = compStore

/**
 * 处理画布点击事件
 */
const handleBoardClick = (e: MouseEvent) => {
  // 简单的事件代理：检查是否点击了组件
  const target = e.target as HTMLElement
  const nodeEl = target.closest('[data-id]')

  if (nodeEl) {
    const id = nodeEl.getAttribute('data-id')
    if (id) {
      setSelected(id)
      e.stopPropagation()
      return
    }
  }

  // 点击空白处，取消选中
  setSelected(null)
}

/**
 * 处理组件拖放
 */
const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()

  try {
    const raw = e.dataTransfer?.getData('application/x-lowcode')
    if (!raw) {
      console.warn('[CanvasBoard] No drag data found')
      return
    }

    const data = JSON.parse(raw)
    const { componentName, props, style } = data

    if (!componentName) {
      console.warn('[CanvasBoard] Invalid component data:', data)
      return
    }

    // V1.5 简化版：直接添加到根节点
    // TODO: 后续可以根据鼠标位置计算应该添加到哪个父组件
    const newId = addComponent(componentName, undefined, props, style)

    if (newId) {
      setSelected(newId)
      console.log('[CanvasBoard] Component added:', componentName, newId)
    }
  } catch (err) {
    console.error('[CanvasBoard] Drop error:', err)
  }
}
</script>

<style scoped>
.canvas-board {
  width: 100%;
  height: 100%;
  background: #f0f2f5;
  overflow: auto;
  position: relative;
}

.canvas-container {
  min-height: 100%;
  padding: 20px;
  position: relative;
}

.canvas-content {
  min-height: calc(100vh - 40px);
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* 空状态 */
.empty-state {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #999;
  pointer-events: none;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state p {
  font-size: 14px;
  margin: 0;
}

/* 选中状态高亮 */
:deep([data-id]) {
  position: relative;
  transition: outline 0.2s;
}

:deep([data-id]:hover) {
  outline: 1px dashed #1890ff;
  outline-offset: 2px;
}

:deep([data-id].selected) {
  outline: 2px solid #1890ff;
  outline-offset: 2px;
}
</style>
