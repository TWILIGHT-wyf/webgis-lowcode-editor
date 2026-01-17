<template>
  <div class="v-text" :style="textStyle">
    {{ content }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'

// 定义纯 UI Props，无业务逻辑
const props = defineProps<{
  // 内容
  content?: string

  // 样式配置
  fontSize?: number
  fontColor?: string
  fontWeight?: 'normal' | 'bold' | 'lighter' | number
  textAlign?: 'left' | 'center' | 'right' | 'justify'
  letterSpacing?: number
  lineHeight?: number
  paddingX?: number
  paddingY?: number
  opacity?: number
  visible?: boolean
  locked?: boolean
}>()

// 计算文本样式
const textStyle = computed<CSSProperties>(() => {
  return {
    opacity: ((props.opacity ?? 100) as number) / 100,
    display: props.visible === false ? 'none' : 'block',
    fontSize: `${props.fontSize ?? 16}px`,
    color: props.fontColor ?? '#000000',
    fontWeight: props.fontWeight ?? 'normal',
    textAlign: props.textAlign ?? 'left',
    letterSpacing: `${props.letterSpacing ?? 0}px`,
    lineHeight: props.lineHeight ?? 1.2,
    padding: `${props.paddingY ?? 0}px ${props.paddingX ?? 0}px`,
    width: '100%',
    height: '100%',
    userSelect: props.locked ? 'none' : 'text',
    pointerEvents: props.locked ? 'none' : 'auto',
    overflow: 'hidden',
    boxSizing: 'border-box',
  }
})
</script>

<style scoped>
.v-text {
  word-break: break-word;
  white-space: pre-wrap;
}
</style>
