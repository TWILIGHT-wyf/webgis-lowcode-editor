<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { CSSProperties } from 'vue'
import { storeToRefs } from 'pinia'
import { useComponent } from '@/stores/component'
import { vPanel as BasePanel } from '@twi1i9ht/visual-lib'
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

// 聚合所有 Props 传递给 Base 组件
const panelProps = computed((): Record<string, unknown> => {
  const s = comp.value?.style || {}
  const p = comp.value?.props || {}
  return {
    // 内容
    title: p.title ?? '面板标题',
    content: hasChildren.value ? undefined : (p.content ?? '这是面板内容'),
    footerContent: p.footerContent ?? '',
    // 功能配置
    showHeader: p.showHeader !== false,
    showFooter: p.showFooter ?? false,
    collapsible: p.collapsible ?? false,
    collapsed: isCollapsed.value,
    // 容器样式
    backgroundColor: s.backgroundColor ?? '#ffffff',
    border: s.border ?? '1px solid #e5e7eb',
    borderRadius: s.borderRadius ?? 4,
    boxShadow: s.boxShadow ?? '0 1px 3px rgba(0, 0, 0, 0.1)',
    // 头部样式
    headerPadding: s.headerPadding ?? 16,
    headerBg: s.headerBg ?? '#f9fafb',
    headerFontSize: s.headerFontSize ?? 14,
    headerColor: s.headerColor ?? '#111827',
    // 内容样式
    bodyPadding: s.bodyPadding ?? 16,
    textColor: s.textColor ?? '#333333',
    fontSize: s.fontSize ?? 14,
    // 底部样式
    footerPadding: s.footerPadding ?? 16,
    footerBg: s.footerBg ?? '#f9fafb',
    footerFontSize: s.footerFontSize ?? 12,
    footerColor: s.footerColor ?? '#6b7280',
  }
})

// 处理折叠切换
const handleToggle = (collapsed: boolean) => {
  isCollapsed.value = collapsed
}

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
    padding: `${padding}px`,
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getChildComponentStyle = (_childId: string): CSSProperties => {
  return {
    width: '100%',
    height: '100%',
  }
}
</script>

<template>
  <BasePanel v-bind="panelProps" @toggle="handleToggle">
    <!-- 子组件渲染 -->
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
  </BasePanel>
</template>

<style scoped>
.child-item {
  box-sizing: border-box;
}
</style>
