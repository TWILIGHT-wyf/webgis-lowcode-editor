<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { CSSProperties } from 'vue'
import { storeToRefs } from 'pinia'
import { useComponent } from '@/stores/component'
import { componentRegistry } from '@/customComponents/registry'
import Shape from '@/components/Editor/shape/shape.vue'

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

// 子组件容器样式(根据布局模式)
const childrenContainerStyle = computed<CSSProperties>(() => {
  const layout = comp.value?.layout
  const mode = layout?.mode || 'absolute'
  const gap = layout?.gap ?? 8
  const padding = layout?.padding ?? 0
  const align = layout?.align || 'start'

  const baseStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
  }

  switch (mode) {
    case 'horizontal':
      return {
        ...baseStyle,
        display: 'flex',
        flexDirection: 'row',
        gap: `${gap}px`,
        alignItems:
          align === 'stretch'
            ? 'stretch'
            : align === 'center'
              ? 'center'
              : align === 'end'
                ? 'flex-end'
                : 'flex-start',
      }
    case 'vertical':
      return {
        ...baseStyle,
        display: 'flex',
        flexDirection: 'column',
        gap: `${gap}px`,
        alignItems:
          align === 'stretch'
            ? 'stretch'
            : align === 'center'
              ? 'center'
              : align === 'end'
                ? 'flex-end'
                : 'flex-start',
      }
    case 'grid':
      return {
        ...baseStyle,
        display: 'grid',
        gridTemplateColumns: `repeat(${layout?.columns || 2}, 1fr)`,
        gap: `${gap}px`,
        alignItems:
          align === 'stretch'
            ? 'stretch'
            : align === 'center'
              ? 'center'
              : align === 'end'
                ? 'end'
                : 'start',
      }
    case 'absolute':
    default:
      return baseStyle
  }
})

// 子组件项样式
const getChildItemStyle = (childId: string): CSSProperties => {
  const layout = comp.value?.layout
  const mode = layout?.mode || 'absolute'
  const child = getChildComponent(childId)

  if (mode === 'absolute' && child) {
    return {
      position: 'absolute',
      left: `${child.position.x}px`,
      top: `${child.position.y}px`,
      width: `${child.size.width}px`,
      height: `${child.size.height}px`,
    }
  }

  return {}
}

// 子组件内部样式
const getChildComponentStyle = (childId: string): CSSProperties => {
  const layout = comp.value?.layout
  const mode = layout?.mode || 'absolute'

  if (mode !== 'absolute') {
    return {
      width: '100%',
      height: '100%',
    }
  }

  return {
    width: '100%',
    height: '100%',
  }
}
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
      <div v-if="hasChildren" :style="childrenContainerStyle">
        <template v-if="comp?.layout?.mode === 'absolute'">
          <!-- 绝对定位模式：用Shape包裹使子组件可拖拽 -->
          <Shape v-for="childId in comp?.children" :key="childId" :id="childId">
            <component
              :is="getComponentByType(getChildComponent(childId)?.type || '')"
              :id="childId"
              :style="{ width: '100%', height: '100%' }"
            />
          </Shape>
        </template>
        <template v-else>
          <!-- 其他布局模式：直接渲染 -->
          <div
            v-for="childId in comp?.children"
            :key="childId"
            class="child-item"
            :style="getChildItemStyle(childId)"
          >
            <component
              :is="getComponentByType(getChildComponent(childId)?.type || '')"
              :id="childId"
              :style="getChildComponentStyle(childId)"
            />
          </div>
        </template>
      </div>
      <template v-else>
        {{ comp?.props?.content || '这是面板内容' }}
      </template>
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
