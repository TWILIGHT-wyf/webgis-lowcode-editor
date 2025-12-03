<template>
  <div class="v-flex-container" :style="containerStyle">
    <slot>
      <div class="v-flex-placeholder" :style="placeholderStyle">
        {{ placeholder }}
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'

// 定义纯 UI Props
const props = defineProps<{
  // Flex 布局属性
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
  gap?: number

  // 容器样式
  padding?: number
  backgroundColor?: string
  borderRadius?: number
  borderWidth?: number
  borderColor?: string
  minHeight?: string

  // 占位文本
  placeholder?: string
  textColor?: string
  fontSize?: number
}>()

// 容器样式
const containerStyle = computed<CSSProperties>(() => {
  return {
    display: 'flex',
    flexDirection: props.flexDirection ?? 'row',
    justifyContent: props.justifyContent ?? 'flex-start',
    alignItems: props.alignItems ?? 'stretch',
    flexWrap: props.flexWrap ?? 'nowrap',
    gap: `${props.gap ?? 0}px`,
    padding: `${props.padding ?? 16}px`,
    backgroundColor: props.backgroundColor ?? 'transparent',
    borderRadius: `${props.borderRadius ?? 0}px`,
    borderWidth: `${props.borderWidth ?? 0}px`,
    borderStyle: props.borderWidth ? 'solid' : 'none',
    borderColor: props.borderColor ?? '#dcdfe6',
    minHeight: props.minHeight ?? '100px',
    width: '100%',
    boxSizing: 'border-box',
  }
})

// 占位样式
const placeholderStyle = computed<CSSProperties>(() => {
  return {
    width: '100%',
    minHeight: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: props.textColor ?? '#909399',
    fontSize: `${props.fontSize ?? 14}px`,
  }
})
</script>

<style scoped>
.v-flex-container {
  box-sizing: border-box;
}

.v-flex-placeholder {
  width: 100%;
}
</style>
