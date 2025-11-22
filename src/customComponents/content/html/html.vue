<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useComponent } from '@/stores/component'
import { useDataSource } from '@/datasource/useDataSource'
import { extractWithFallback } from '@/datasource/dataUtils'
import DOMPurify from 'dompurify'

const props = defineProps<{
  id: string
}>()

const { componentStore } = storeToRefs(useComponent())

const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 数据源
const dataSourceRef = computed(() => comp.value?.dataSource)
const { data: dataSourceData } = useDataSource(dataSourceRef)

// HTML 内容
const htmlContent = computed(() => {
  // 优先使用数据源
  if (dataSourceData.value) {
    const contentField: string = (comp.value?.dataSource?.contentField as string) || 'content'
    return extractWithFallback<string>(dataSourceData.value, contentField, '')
  }
  // 使用 props 中的 content
  return String(comp.value?.props?.content || '<p>请输入 HTML 内容...</p>')
})

// 清理后的 HTML
const sanitizedHtml = computed(() => {
  const enableSanitize = comp.value?.props?.sanitize !== false
  if (enableSanitize) {
    // 使用 DOMPurify 清理 HTML,防止 XSS 攻击
    return DOMPurify.sanitize(htmlContent.value, {
      ALLOWED_TAGS: comp.value?.props?.allowedTags
        ? String(comp.value.props.allowedTags).split(',')
        : undefined,
      ALLOWED_ATTR: comp.value?.props?.allowedAttributes
        ? String(comp.value.props.allowedAttributes).split(',')
        : undefined,
    })
  }
  return htmlContent.value
})

// 样式
const containerStyle = computed(() => {
  const s = comp.value?.style || {}
  return {
    width: '100%',
    height: '100%',
    padding: `${s.padding || 16}px`,
    backgroundColor: String(s.backgroundColor || '#ffffff'),
    color: String(s.textColor || '#333333'),
    fontSize: `${s.fontSize || 14}px`,
    lineHeight: String(s.lineHeight || 1.6),
    borderRadius: `${s.borderRadius || 0}px`,
    border: String(s.border || 'none'),
    overflow: String(s.overflow || 'auto'),
    fontFamily: String(s.fontFamily || 'inherit'),
  }
})
</script>

<template>
  <div :style="containerStyle" class="html-container" v-html="sanitizedHtml"></div>
</template>

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
