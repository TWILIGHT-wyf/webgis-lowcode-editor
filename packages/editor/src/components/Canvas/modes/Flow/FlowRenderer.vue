<template>
  <template v-for="node in nodes" :key="node.id">
    <NodeWrapper :node-id="node.id" :component-name="node.componentName" :node="node">
      <!-- Render the actual component -->
      <component
        v-if="isResolved(node)"
        :is="getComponentRef(node)"
        v-bind="node.props"
        :style="getInnerStyle(node)"
        :data-id="node.id"
        :data-component="node.componentName"
        class="flow-node-content"
      >
        <!-- Recursively render children -->
        <FlowRenderer v-if="node.children && node.children.length" :nodes="node.children" />
      </component>

      <!-- Fallback for unresolved components -->
      <div
        v-else
        class="flow-node-content flow-node-unresolved"
        :data-id="node.id"
        :data-component="node.componentName"
      >
        <div class="unresolved-label">{{ node.componentName }} (未找到)</div>
        <!-- Still render children even if component not found -->
        <FlowRenderer v-if="node.children && node.children.length" :nodes="node.children" />
      </div>
    </NodeWrapper>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { NodeSchema } from '@vela/core'
import { getComponent, hasComponent } from '@vela/materials'
import NodeWrapper from './NodeWrapper.vue'

interface Props {
  nodes: NodeSchema[]
}

const props = defineProps<Props>()

/**
 * 检查组件是否已注册
 */
function isResolved(node: NodeSchema): boolean {
  return hasComponent(node.componentName)
}

/**
 * 获取组件引用
 */
function getComponentRef(node: NodeSchema) {
  return getComponent(node.componentName)
}

/**
 * 获取内部组件样式（排除布局相关的样式）
 * 布局样式 (width, minHeight) 由 NodeWrapper 控制
 */
function getInnerStyle(node: NodeSchema): Record<string, any> {
  if (!node.style) return {}

  // 复制样式，排除由 NodeWrapper 控制的属性
  const { width, minHeight, height, ...innerStyle } = node.style
  return innerStyle
}
</script>

<style scoped>
.flow-node-content {
  width: 100%;
  min-height: inherit;
}

.flow-node-unresolved {
  border: 2px dashed #f56c6c;
  background-color: rgba(245, 108, 108, 0.1);
  min-height: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
}

.unresolved-label {
  color: #f56c6c;
  font-size: 12px;
  padding: 4px 8px;
  background: rgba(245, 108, 108, 0.2);
  border-radius: 4px;
}
</style>
