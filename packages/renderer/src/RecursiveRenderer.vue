<template>
  <component
    :is="componentRef"
    v-bind="node.props"
    :id="node.id"
    class="lowcode-node"
    :data-id="node.id"
  >
    <template v-if="node.children && node.children.length">
      <RecursiveRenderer v-for="child in node.children" :key="child.id" :node="child" />
    </template>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { NodeSchema } from '@lowcode/core'
import { getComponent } from '@lowcode/materials'

const props = defineProps<{
  node: NodeSchema
}>()

// 根据 componentName 获取真实的 Vue 组件
const componentRef = computed(() => {
  const comp = getComponent(props.node.componentName)
  return comp || 'div' // 兜底
})
</script>

<style scoped>
.lowcode-node {
  position: relative;
}
</style>
