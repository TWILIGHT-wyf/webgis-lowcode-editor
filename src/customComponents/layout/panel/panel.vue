<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useComponent } from '@/stores/component'

const props = defineProps<{
  id: string
}>()

const { componentStore } = storeToRefs(useComponent())

const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 折叠状态
const isCollapsed = ref(false)

// 监听 props 变化
watch(
  () => comp.value?.props?.collapsed,
  (newValue) => {
    isCollapsed.value = Boolean(newValue)
  },
  { immediate: true },
)

// 切换折叠
const toggleCollapse = () => {
  if (comp.value?.props?.collapsible) {
    isCollapsed.value = !isCollapsed.value
  }
}

// 样式
const containerStyle = computed(() => {
  const s = comp.value?.style || {}
  return {
    backgroundColor: String(s.backgroundColor || '#ffffff'),
    border: String(s.border || '1px solid #e5e7eb'),
    borderRadius: `${s.borderRadius || 4}px`,
    overflow: 'hidden',
    boxShadow: String(s.boxShadow || '0 1px 3px rgba(0, 0, 0, 0.1)'),
  }
})

const headerStyle = computed(() => {
  const s = comp.value?.style || {}
  return {
    padding: `${s.headerPadding || 16}px`,
    backgroundColor: String(s.headerBg || '#f9fafb'),
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: comp.value?.props?.collapsible ? 'pointer' : 'default',
    fontWeight: 600,
    fontSize: `${s.headerFontSize || 14}px`,
    color: String(s.headerColor || '#111827'),
  }
})

const bodyStyle = computed(() => {
  const s = comp.value?.style || {}
  return {
    padding: `${s.bodyPadding || 16}px`,
    color: String(s.textColor || '#333333'),
    fontSize: `${s.fontSize || 14}px`,
    display: isCollapsed.value ? 'none' : 'block',
  }
})

const footerStyle = computed(() => {
  const s = comp.value?.style || {}
  return {
    padding: `${s.footerPadding || 16}px`,
    backgroundColor: String(s.footerBg || '#f9fafb'),
    borderTop: '1px solid #e5e7eb',
    fontSize: `${s.footerFontSize || 12}px`,
    color: String(s.footerColor || '#6b7280'),
  }
})
</script>

<template>
  <div :style="containerStyle">
    <!-- 头部 -->
    <div :style="headerStyle" @click="toggleCollapse" v-if="comp?.props?.showHeader !== false">
      <span>{{ comp?.props?.title || '面板标题' }}</span>
      <span v-if="comp?.props?.collapsible">{{ isCollapsed ? '▼' : '▲' }}</span>
    </div>

    <!-- 内容 -->
    <div :style="bodyStyle">
      {{ comp?.props?.content || '这是面板内容' }}
    </div>

    <!-- 底部 -->
    <div :style="footerStyle" v-if="comp?.props?.showFooter && comp?.props?.footerContent">
      {{ comp.props.footerContent }}
    </div>
  </div>
</template>

<style scoped>
/* 样式已内联 */
</style>
