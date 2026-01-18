<template>
  <component
    v-if="isResolved"
    :is="componentRef"
    v-bind="node.props"
    :style="node.style"
    :id="node.id"
    class="lowcode-node"
    :data-id="node.id"
    :data-component="node.componentName"
  >
    <template v-if="node.children && node.children.length">
      <RecursiveRenderer v-for="child in node.children" :key="child.id" :node="child" />
    </template>
  </component>
  <!-- Fallback for unresolved components -->
  <div
    v-else
    class="lowcode-node lowcode-node--unresolved"
    :id="node.id"
    :data-id="node.id"
    :data-component="node.componentName"
    :style="node.style"
  >
    <div class="unresolved-label">{{ node.componentName }} (未找到)</div>
    <template v-if="node.children && node.children.length">
      <RecursiveRenderer v-for="child in node.children" :key="child.id" :node="child" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type { NodeSchema } from '@vela/core'
import { getComponent, hasComponent } from '@vela/materials'

const props = defineProps<{
  node: NodeSchema
}>()

// 检查组件是否已注册
const isResolved = computed(() => {
  return hasComponent(props.node.componentName)
})

// 根据 componentName 获取真实的 Vue 组件
const componentRef = computed(() => {
  const comp = getComponent(props.node.componentName)
  return comp
})

// Debug: log when component is not found
onMounted(() => {
  if (!isResolved.value) {
    console.warn(
      `[RecursiveRenderer] Component "${props.node.componentName}" not found in registry. Node ID: ${props.node.id}`,
    )
  }
})
</script>

<style scoped>
.lowcode-node {
  position: relative;
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
