<template>
  <div :style="containerStyle" class="html-container" v-html="sanitizedHtml"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'
import DOMPurify from 'dompurify'

const props = withDefaults(
  defineProps<{
    content?: string
    sanitize?: boolean
    allowedTags?: string
    allowedAttributes?: string
    padding?: number
    backgroundColor?: string
    textColor?: string
    fontSize?: number
    lineHeight?: number | string
    borderRadius?: number
    border?: string
    overflow?: string
    fontFamily?: string
  }>(),
  {
    content: '<p>请输入 HTML 内容...</p>',
    sanitize: true,
    allowedTags: undefined,
    allowedAttributes: undefined,
    padding: 16,
    backgroundColor: '#ffffff',
    textColor: '#333333',
    fontSize: 14,
    lineHeight: 1.6,
    borderRadius: 0,
    border: 'none',
    overflow: 'auto',
    fontFamily: 'inherit',
  },
)

// 清理后的 HTML
const sanitizedHtml = computed(() => {
  if (props.sanitize) {
    return DOMPurify.sanitize(props.content, {
      ALLOWED_TAGS: props.allowedTags ? props.allowedTags.split(',') : undefined,
      ALLOWED_ATTR: props.allowedAttributes ? props.allowedAttributes.split(',') : undefined,
    })
  }
  return props.content
})

// 样式
const containerStyle = computed<CSSProperties>(() => ({
  width: '100%',
  height: '100%',
  padding: `${props.padding}px`,
  backgroundColor: props.backgroundColor,
  color: props.textColor,
  fontSize: `${props.fontSize}px`,
  lineHeight: String(props.lineHeight),
  borderRadius: `${props.borderRadius}px`,
  border: props.border,
  overflow: props.overflow,
  fontFamily: props.fontFamily,
}))
</script>

<style scoped>
.html-container {
  box-sizing: border-box;
}

/* 基础样式重置 */
.html-container :deep(*) {
  box-sizing: border-box;
}

.html-container :deep(img) {
  max-width: 100%;
  height: auto;
}

.html-container :deep(table) {
  border-collapse: collapse;
  width: 100%;
}

.html-container :deep(table th),
.html-container :deep(table td) {
  padding: 8px;
  border: 1px solid #ddd;
}

.html-container :deep(a) {
  color: #409eff;
  text-decoration: none;
}

.html-container :deep(a:hover) {
  text-decoration: underline;
}
</style>
