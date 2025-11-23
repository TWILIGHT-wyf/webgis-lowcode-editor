<script setup lang="ts">
import { computed } from 'vue'
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

// 样式
const containerStyle = computed(() => {
  const s = comp.value?.style || {}
  return {
    display: 'grid',
    gridTemplateColumns: String(s.gridTemplateColumns || 'repeat(3, 1fr)'),
    gridTemplateRows: String(s.gridTemplateRows || 'auto'),
    gap: `${s.gridGap || 16}px`,
    gridAutoFlow: String(s.gridAutoFlow || 'row'),
    padding: `${s.padding || 16}px`,
    backgroundColor: String(s.backgroundColor || '#ffffff'),
    border: String(s.border || '1px solid #e5e7eb'),
    borderRadius: `${s.borderRadius || 4}px`,
    minHeight: `${s.minHeight || 200}px`,
    color: String(s.textColor || '#333333'),
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

<template>
  <div :style="containerStyle">
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
    <template v-else-if="comp?.props?.content">
      <div>{{ comp.props.content }}</div>
    </template>
    <template v-else>
      <div>Grid 1</div>
      <div>Grid 2</div>
      <div>Grid 3</div>
    </template>
  </div>
</template>

<style scoped>
div > div {
  padding: 12px;
  background-color: #f3f4f6;
  border-radius: 4px;
  text-align: center;
}
</style>
