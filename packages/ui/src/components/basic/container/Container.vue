<template>
  <div class="v-container" :style="containerStyle">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'

// 定义纯 UI Props
const props = withDefaults(
  defineProps<{
    // 尺寸
    width?: string | number
    height?: string | number
    minHeight?: string | number

    // 布局
    display?: 'block' | 'flex' | 'grid' | 'inline-block'
    flexDirection?: 'row' | 'column'
    justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'
    alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch'
    gap?: number

    // 间距
    padding?: number | string
    margin?: number | string

    // 背景
    backgroundColor?: string
    backgroundImage?: string
    backgroundSize?: string
    backgroundPosition?: string

    // 边框
    border?: string
    borderRadius?: number
    borderWidth?: number
    borderColor?: string
    borderStyle?: 'solid' | 'dashed' | 'dotted'

    // 阴影
    boxShadow?: string

    // 其他
    overflow?: 'visible' | 'hidden' | 'scroll' | 'auto'
    position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'
  }>(),
  {
    width: '100%',
    height: 'auto',
    display: 'block',
    backgroundColor: 'transparent',
    overflow: 'visible',
    position: 'relative',
  },
)

// 容器样式
const containerStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {
    width: typeof props.width === 'number' ? `${props.width}px` : props.width,
    height: typeof props.height === 'number' ? `${props.height}px` : props.height,
    display: props.display,
    backgroundColor: props.backgroundColor,
    overflow: props.overflow,
    position: props.position,
    boxSizing: 'border-box',
  }

  // 最小高度
  if (props.minHeight !== undefined) {
    style.minHeight = typeof props.minHeight === 'number' ? `${props.minHeight}px` : props.minHeight
  }

  // Flex 布局
  if (props.display === 'flex') {
    style.flexDirection = props.flexDirection
    style.justifyContent = props.justifyContent
    style.alignItems = props.alignItems
    if (props.gap !== undefined) {
      style.gap = `${props.gap}px`
    }
  }

  // 间距
  if (props.padding !== undefined) {
    style.padding = typeof props.padding === 'number' ? `${props.padding}px` : props.padding
  }
  if (props.margin !== undefined) {
    style.margin = typeof props.margin === 'number' ? `${props.margin}px` : props.margin
  }

  // 背景
  if (props.backgroundImage) {
    style.backgroundImage = props.backgroundImage
    style.backgroundSize = props.backgroundSize ?? 'cover'
    style.backgroundPosition = props.backgroundPosition ?? 'center'
  }

  // 边框
  if (props.border) {
    style.border = props.border
  } else if (props.borderWidth !== undefined) {
    style.border = `${props.borderWidth}px ${props.borderStyle ?? 'solid'} ${props.borderColor ?? '#dcdfe6'}`
  }

  if (props.borderRadius !== undefined) {
    style.borderRadius = `${props.borderRadius}px`
  }

  // 阴影
  if (props.boxShadow) {
    style.boxShadow = props.boxShadow
  }

  return style
})
</script>

<style scoped>
.v-container {
  box-sizing: border-box;
}
</style>
