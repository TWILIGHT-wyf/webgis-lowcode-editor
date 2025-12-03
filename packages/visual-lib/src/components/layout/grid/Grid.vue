<template>
  <div class="v-grid-container" :style="containerStyle">
    <slot>
      <template v-if="placeholderItems.length">
        <div v-for="(item, idx) in placeholderItems" :key="idx" class="v-grid-placeholder-item">
          {{ item }}
        </div>
      </template>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'

// 定义纯 UI Props
const props = defineProps<{
  // Grid 布局属性
  gridTemplateColumns?: string
  gridTemplateRows?: string
  gridGap?: number
  gridAutoFlow?: 'row' | 'column' | 'dense' | 'row dense' | 'column dense'

  // 容器样式
  padding?: number
  backgroundColor?: string
  border?: string
  borderRadius?: number
  minHeight?: number
  textColor?: string

  // 占位内容
  content?: string
  placeholderItems?: string[]
}>()

// 容器样式
const containerStyle = computed<CSSProperties>(() => {
  return {
    display: 'grid',
    gridTemplateColumns: props.gridTemplateColumns ?? 'repeat(3, 1fr)',
    gridTemplateRows: props.gridTemplateRows ?? 'auto',
    gap: `${props.gridGap ?? 16}px`,
    gridAutoFlow: props.gridAutoFlow ?? 'row',
    padding: `${props.padding ?? 16}px`,
    backgroundColor: props.backgroundColor ?? '#ffffff',
    border: props.border ?? '1px solid #e5e7eb',
    borderRadius: `${props.borderRadius ?? 4}px`,
    minHeight: `${props.minHeight ?? 200}px`,
    color: props.textColor ?? '#333333',
    boxSizing: 'border-box',
  }
})

// 占位项
const placeholderItems = computed(() => {
  return props.placeholderItems ?? ['Grid 1', 'Grid 2', 'Grid 3']
})
</script>

<style scoped>
.v-grid-container {
  box-sizing: border-box;
  width: 100%;
}

.v-grid-placeholder-item {
  padding: 12px;
  background-color: #f3f4f6;
  border-radius: 4px;
  text-align: center;
}
</style>
