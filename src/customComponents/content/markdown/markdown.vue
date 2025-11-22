<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useComponent } from '@/stores/component'
import { useDataSource } from '@/datasource/useDataSource'
import { extractWithFallback } from '@/datasource/dataUtils'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const props = defineProps<{
  id: string
}>()

const { componentStore } = storeToRefs(useComponent())

const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 数据源
const dataSourceRef = computed(() => comp.value?.dataSource)
const { data: dataSourceData } = useDataSource(dataSourceRef)

// Markdown 内容
const markdownContent = computed(() => {
  // 优先使用数据源
  if (dataSourceData.value) {
    const contentField: string = (comp.value?.dataSource?.contentField as string) || 'content'
    return extractWithFallback<string>(dataSourceData.value, contentField, '')
  }
  // 使用 props 中的 content
  return String(comp.value?.props?.content || '# Markdown 内容\n\n请输入 Markdown 文本...')
})

// 渲染的 HTML
const renderedHtml = computed(() => {
  try {
    const html = marked(markdownContent.value)
    // 使用 DOMPurify 清理 HTML,防止 XSS 攻击
    return DOMPurify.sanitize(String(html))
  } catch (error) {
    console.error('Markdown 渲染失败:', error)
    return '<p>Markdown 渲染失败</p>'
  }
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
    overflow: 'auto',
    fontFamily: String(s.fontFamily || 'inherit'),
  }
})
</script>

<template>
  <div :style="containerStyle" class="markdown-body" v-html="renderedHtml"></div>
</template>

<style scoped>
.markdown-body {
  box-sizing: border-box;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4),
.markdown-body :deep(h5),
.markdown-body :deep(h6) {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-body :deep(h1) {
  font-size: 2em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

.markdown-body :deep(h2) {
  font-size: 1.5em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

.markdown-body :deep(h3) {
  font-size: 1.25em;
}

.markdown-body :deep(p) {
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 2em;
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-body :deep(li) {
  margin-bottom: 4px;
}

.markdown-body :deep(code) {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(175, 184, 193, 0.2);
  border-radius: 6px;
  font-family: monospace;
}

.markdown-body :deep(pre) {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 6px;
  margin-bottom: 16px;
}

.markdown-body :deep(pre code) {
  background-color: transparent;
  padding: 0;
}

.markdown-body :deep(blockquote) {
  padding: 0 1em;
  color: #6a737d;
  border-left: 0.25em solid #dfe2e5;
  margin: 0 0 16px 0;
}

.markdown-body :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 16px;
}

.markdown-body :deep(table th),
.markdown-body :deep(table td) {
  padding: 6px 13px;
  border: 1px solid #dfe2e5;
}

.markdown-body :deep(table th) {
  font-weight: 600;
  background-color: #f6f8fa;
}

.markdown-body :deep(img) {
  max-width: 100%;
  box-sizing: content-box;
}

.markdown-body :deep(a) {
  color: #0366d6;
  text-decoration: none;
}

.markdown-body :deep(a:hover) {
  text-decoration: underline;
}
</style>
