<template>
  <div class="v-panel" :style="containerStyle">
    <!-- 头部 -->
    <div v-if="showHeader" class="v-panel-header" :style="headerStyle" @click="handleHeaderClick">
      <span>{{ title }}</span>
      <span v-if="collapsible" class="v-panel-collapse-icon">
        {{ isCollapsed ? '▼' : '▲' }}
      </span>
    </div>

    <!-- 内容 -->
    <div class="v-panel-body" :style="bodyStyle">
      <slot>
        <span v-if="content">{{ content }}</span>
      </slot>
    </div>

    <!-- 底部 -->
    <div v-if="showFooter && footerContent" class="v-panel-footer" :style="footerStyle">
      {{ footerContent }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { CSSProperties } from 'vue'

// 定义纯 UI Props
const props = defineProps<{
  // 内容
  title?: string
  content?: string
  footerContent?: string

  // 功能配置
  showHeader?: boolean
  showFooter?: boolean
  collapsible?: boolean
  collapsed?: boolean

  // 容器样式
  backgroundColor?: string
  border?: string
  borderRadius?: number
  boxShadow?: string

  // 头部样式
  headerPadding?: number
  headerBg?: string
  headerFontSize?: number
  headerColor?: string

  // 内容样式
  bodyPadding?: number
  textColor?: string
  fontSize?: number

  // 底部样式
  footerPadding?: number
  footerBg?: string
  footerFontSize?: number
  footerColor?: string
}>()

const emit = defineEmits<{
  (e: 'update:collapsed', value: boolean): void
  (e: 'toggle', value: boolean): void
}>()

// 折叠状态
const isCollapsed = ref(props.collapsed ?? false)

// 监听外部 collapsed 变化
watch(
  () => props.collapsed,
  (newVal) => {
    isCollapsed.value = newVal ?? false
  },
)

// 切换折叠
const handleHeaderClick = () => {
  if (props.collapsible) {
    isCollapsed.value = !isCollapsed.value
    emit('update:collapsed', isCollapsed.value)
    emit('toggle', isCollapsed.value)
  }
}

// 容器样式
const containerStyle = computed<CSSProperties>(() => {
  return {
    backgroundColor: props.backgroundColor ?? '#ffffff',
    border: props.border ?? '1px solid #e5e7eb',
    borderRadius: `${props.borderRadius ?? 4}px`,
    overflow: 'hidden',
    boxShadow: props.boxShadow ?? '0 1px 3px rgba(0, 0, 0, 0.1)',
    boxSizing: 'border-box',
  }
})

// 头部样式
const headerStyle = computed<CSSProperties>(() => {
  return {
    padding: `${props.headerPadding ?? 16}px`,
    backgroundColor: props.headerBg ?? '#f9fafb',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: props.collapsible ? 'pointer' : 'default',
    fontWeight: 600,
    fontSize: `${props.headerFontSize ?? 14}px`,
    color: props.headerColor ?? '#111827',
  }
})

// 内容样式
const bodyStyle = computed<CSSProperties>(() => {
  return {
    padding: `${props.bodyPadding ?? 16}px`,
    color: props.textColor ?? '#333333',
    fontSize: `${props.fontSize ?? 14}px`,
    display: isCollapsed.value ? 'none' : 'block',
  }
})

// 底部样式
const footerStyle = computed<CSSProperties>(() => {
  return {
    padding: `${props.footerPadding ?? 16}px`,
    backgroundColor: props.footerBg ?? '#f9fafb',
    borderTop: '1px solid #e5e7eb',
    fontSize: `${props.footerFontSize ?? 12}px`,
    color: props.footerColor ?? '#6b7280',
  }
})
</script>

<style scoped>
.v-panel {
  box-sizing: border-box;
  width: 100%;
}

.v-panel-header {
  user-select: none;
}

.v-panel-collapse-icon {
  font-size: 12px;
}

.v-panel-body {
  box-sizing: border-box;
}

.v-panel-footer {
  box-sizing: border-box;
}
</style>
