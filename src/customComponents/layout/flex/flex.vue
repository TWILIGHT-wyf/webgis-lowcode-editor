<template>
  <div class="flex-container" :style="containerStyle">
    <div v-if="hasChildren" :style="childrenContainerStyle">
      <template v-if="comp?.layout?.mode === 'absolute'">
        <Shape v-for="childId in comp?.children" :key="childId" :id="childId">
          <component
            :is="getComponentByType(getChildComponent(childId)?.type || '')"
            :id="childId"
            :style="{ width: '100%', height: '100%' }"
          />
        </Shape>
      </template>
      <template v-else>
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
    <div v-else class="flex-content" :style="contentStyle">
      {{ content || 'Flex弹性布局容器 - 可拖入其他组件' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'
import { useComponent } from '@/stores/component'
import { storeToRefs } from 'pinia'
import { componentRegistry } from '@/customComponents/registry'
import Shape from '@/components/Editor/shape/shape.vue'

const props = defineProps<{ id: string }>()
const { componentStore } = storeToRefs(useComponent())

const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 样式
const containerStyle = computed(() => {
  const s = comp.value?.style || {}
  const wrap = String(s.flexWrap || 'nowrap')
  const validWrap =
    wrap === 'wrap' || wrap === 'nowrap' || wrap === 'wrap-reverse' ? wrap : 'nowrap'
  return {
    display: 'flex',
    flexDirection: String(s.flexDirection || 'row') as 'row' | 'column',
    justifyContent: String(s.justifyContent || 'flex-start'),
    alignItems: String(s.alignItems || 'stretch'),
    flexWrap: validWrap as 'wrap' | 'nowrap' | 'wrap-reverse',
    gap: `${s.gap || 0}px`,
    padding: `${s.padding || 16}px`,
    backgroundColor: String(s.backgroundColor || 'transparent'),
    borderRadius: `${s.borderRadius || 0}px`,
    borderWidth: `${s.borderWidth || 0}px`,
    borderStyle: s.borderWidth ? 'solid' : 'none',
    borderColor: String(s.borderColor || '#dcdfe6'),
    minHeight: String(s.minHeight || '100px'),
    width: '100%',
  }
})

const contentStyle = computed(() => {
  const s = comp.value?.style || {}
  return {
    width: '100%',
    minHeight: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: String(s.textColor || '#909399'),
    fontSize: `${s.fontSize || 14}px`,
  }
})

// 组件属性
const content = computed(() => String(comp.value?.props.content || ''))

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

<style scoped>
.flex-container {
  width: 100%;
}

.flex-content {
  width: 100%;
}
</style>
