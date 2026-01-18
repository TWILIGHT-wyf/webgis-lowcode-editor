<template>
  <ShapeWrapper
    v-if="node"
    :node="node"
    @open-context-menu="handleContextMenu"
    @snap-lines="handleSnapLines"
  >
    <!-- 渲染实际的 UI 组件 -->
    <component
      v-if="isResolved"
      :is="componentRef"
      v-bind="node.props"
      :style="componentStyle"
      class="lowcode-node"
    >
      <!-- 递归渲染子节点 -->
      <template v-if="node.children && node.children.length">
        <FreeRenderer
          v-for="child in node.children"
          :key="child.id"
          :node="child"
          @open-context-menu="handleContextMenu"
          @snap-lines="handleSnapLines"
        />
      </template>
    </component>

    <!-- Fallback for unresolved components -->
    <div v-else class="lowcode-node lowcode-node--unresolved" :style="componentStyle">
      <div class="unresolved-label">{{ node.componentName }} (未找到)</div>
      <template v-if="node.children && node.children.length">
        <FreeRenderer
          v-for="child in node.children"
          :key="child.id"
          :node="child"
          @open-context-menu="handleContextMenu"
          @snap-lines="handleSnapLines"
        />
      </template>
    </div>
  </ShapeWrapper>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type { NodeSchema } from '@vela/core'
import { getComponent, hasComponent } from '@vela/materials'
import ShapeWrapper from './Shape/ShapeWrapper.vue'

const props = defineProps<{
  node: NodeSchema
}>()

const emit = defineEmits<{
  (e: 'open-context-menu', payload: { id: string; event: MouseEvent }): void
  (e: 'snap-lines', lines: { x?: number; y?: number }[]): void
}>()

// Bubble events up
function handleContextMenu(payload: { id: string; event: MouseEvent }) {
  emit('open-context-menu', payload)
}

function handleSnapLines(lines: { x?: number; y?: number }[]) {
  emit('snap-lines', lines)
}

// 检查组件是否已注册
const isResolved = computed(() => {
  return hasComponent(props.node.componentName)
})

// 根据 componentName 获取真实的 Vue 组件
const componentRef = computed(() => {
  const comp = getComponent(props.node.componentName)
  return comp
})

// 组件样式 - 排除 ShapeWrapper 已处理的位置/尺寸属性
const componentStyle = computed(() => {
  const style = { ...props.node.style }

  // ShapeWrapper 处理这些属性，所以从内部组件中移除
  delete style.position
  delete style.left
  delete style.top
  delete style.width
  delete style.height
  delete style.transform
  delete style.zIndex

  return style
})

// Debug: log when component is not found
onMounted(() => {
  if (!isResolved.value) {
    console.warn(
      `[FreeRenderer] Component "${props.node.componentName}" not found in registry. Node ID: ${props.node.id}`,
    )
  }
})
</script>

<style scoped>
.lowcode-node {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.lowcode-node--unresolved {
  border: 2px dashed #f56c6c;
  background-color: rgba(245, 108, 108, 0.1);
  min-height: 40px;
  min-width: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.unresolved-label {
  color: #f56c6c;
  font-size: 12px;
  padding: 4px 8px;
  background: rgba(245, 108, 108, 0.2);
  border-radius: 4px;
}
</style>
