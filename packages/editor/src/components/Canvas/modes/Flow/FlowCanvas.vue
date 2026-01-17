<template>
  <div ref="flowCanvasRef" class="flow-canvas" @click="handleCanvasClick">
    <!-- 使用递归渲染器渲染组件树 -->
    <div v-if="currentTree" class="flow-content">
      <RecursiveRenderer :node="currentTree" />
    </div>

    <!-- 空状态提示 -->
    <div v-if="!currentTree?.children || currentTree.children.length === 0" class="empty-state">
      <div class="empty-icon">📄</div>
      <p>从左侧拖拽组件到此处开始搭建流式布局</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useComponentStoreV2 } from '@/stores/componentV2'
import { RecursiveRenderer } from '@vela/renderer'

const componentStore = useComponentStoreV2()
const { currentTree, selectedId } = storeToRefs(componentStore)
const { setSelected } = componentStore

const flowCanvasRef = ref<HTMLElement | null>(null)

/**
 * 处理画布点击 - 取消选中
 */
const handleCanvasClick = (e: MouseEvent) => {
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
</script>

<style scoped>
.flow-canvas {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  background: #f0f2f5;
  padding: 20px;
  box-sizing: border-box;
}

.flow-content {
  min-height: calc(100vh - 40px);
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 20px;
}

/* 空状态提示 */
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

/* 为文档流模式提供默认样式 */
.flow-canvas :deep([data-id]) {
  position: relative;
  transition: outline 0.2s;
}

/* 悬停状态 */
.flow-canvas :deep([data-id]:hover) {
  outline: 1px dashed #409eff;
  outline-offset: 2px;
}

/* 选中状态 */
.flow-canvas :deep([data-id].selected) {
  outline: 2px solid #409eff;
  outline-offset: 2px;
  border-radius: 4px;
}
</style>
