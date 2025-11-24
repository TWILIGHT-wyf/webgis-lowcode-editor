<template>
  <div class="group-container">
    <!-- 渲染子组件 -->
    <div v-if="hasChildren" :style="childrenContainerStyle">
      <!-- 子组件使用绝对定位，相对于组合容器 -->
      <div
        v-for="childId in comp?.children"
        :key="childId"
        class="child-item"
        :style="getChildItemStyle(childId)"
      >
        <component
          :is="getComponentByType(getChildComponent(childId)?.type || '')"
          :id="childId"
          :style="{ width: '100%', height: '100%' }"
        />
      </div>
    </div>
    <!-- 空状态占位符 -->
    <div v-else class="group-placeholder">组合</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'
import { useComponent } from '@/stores/component'
import { storeToRefs } from 'pinia'
import { componentRegistry } from '@/customComponents/registry'

const props = defineProps<{ id: string }>()
const { componentStore } = storeToRefs(useComponent())

const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 子组件相关
const hasChildren = computed(() => {
  return comp.value?.children && comp.value.children.length > 0
})

const getChildComponent = (childId: string) => {
  return componentStore.value.find((c) => c.id === childId)
}

const getComponentByType = (type: string) => {
  return componentRegistry[type] || 'div'
}

// 子组件容器样式
const childrenContainerStyle = computed<CSSProperties>(() => {
  return {
    position: 'relative',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
  }
})

// 子组件项样式 - 使用相对于组合的绝对定位
const getChildItemStyle = (childId: string): CSSProperties => {
  const child = getChildComponent(childId)
  const parentComp = comp.value

  if (!child || !parentComp) return {}

  // 计算子组件相对于组合的位置
  const relativeX = child.position.x - parentComp.position.x
  const relativeY = child.position.y - parentComp.position.y

  return {
    position: 'absolute',
    left: `${relativeX}px`,
    top: `${relativeY}px`,
    width: `${child.size.width}px`,
    height: `${child.size.height}px`,
    transform: `rotate(${child.rotation || 0}deg)`,
    zIndex: child.zindex || 0,
  }
}
</script>

<style scoped>
.group-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.child-item {
  pointer-events: auto;
}

.group-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #909399;
  font-size: 12px;
  opacity: 0.5;
  pointer-events: none;
}
</style>
