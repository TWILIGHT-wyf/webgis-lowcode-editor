<template>
  <div class="badge-container" :style="containerStyle">
    <el-badge
      :value="processedValue"
      :type="badgeType"
      :is-dot="isDot"
      :max="maxValue"
      :hidden="hideBadge"
      :show-zero="showZero"
      :offset="badgeOffset"
    >
      <!-- 如果有子组件，渲染子组件；否则显示默认文本 -->
      <div v-if="hasChildren" class="badge-slot-wrapper" :style="childrenContainerStyle">
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
      </div>
      <span v-else-if="showSlotContent" :style="slotContentStyle">{{ slotText }}</span>
    </el-badge>
  </div>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import type { CSSProperties } from 'vue'
import { useComponent } from '@/stores/component'
import { storeToRefs } from 'pinia'
import { useDataSource } from '@/datasource/useDataSource'
import { extractWithFallback } from '@/datasource/dataUtils'
import { componentRegistry } from '@/customComponents/registry'

const props = defineProps<{ id: string }>()
const { componentStore } = storeToRefs(useComponent())

const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 数据源
const dataSourceRef = toRef(() => comp.value?.dataSource)
const { data: remoteData } = useDataSource(dataSourceRef)

// 显示值
const displayValue = computed<string | number>(() => {
  const ds = comp.value?.dataSource
  const localValue = (comp.value?.props.value as string | number) ?? ''

  if (ds?.enabled && remoteData.value) {
    return extractWithFallback(remoteData.value, ds.valuePath, localValue) as string | number
  }
  return localValue
})

// 组件属性
const badgeType = computed<'primary' | 'success' | 'warning' | 'danger' | 'info'>(() => {
  const t = (comp.value?.props.type as string) ?? 'primary'
  return t as 'primary' | 'success' | 'warning' | 'danger' | 'info'
})

const isDot = computed<boolean>(() => (comp.value?.props.dot as boolean) ?? false)
const maxValue = computed<number>(() => (comp.value?.props.maxValue as number) ?? 99)
const hideBadge = computed<boolean>(() => (comp.value?.props.hidden as boolean) ?? false)
const showZero = computed<boolean>(() => (comp.value?.props.showZero as boolean) ?? false)

// 偏移量 [x, y]
const badgeOffset = computed<[number, number]>(() => {
  const offsetX = (comp.value?.props.offsetX as number) ?? 0
  const offsetY = (comp.value?.props.offsetY as number) ?? 0
  return [offsetX, offsetY]
})

// 插槽内容
const showSlotContent = computed<boolean>(() => (comp.value?.props.showSlot as boolean) ?? true)
const slotText = computed<string>(() => (comp.value?.props.slotText as string) ?? '')

// 处理显示值
const processedValue = computed(() => {
  if (isDot.value) return ''
  const val = displayValue.value
  if (typeof val === 'number' && val > maxValue.value) {
    return `${maxValue.value}+`
  }
  return val
})

// 样式
const containerStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    opacity: ((s.opacity ?? 100) as number) / 100,
    display: s.visible === false ? 'none' : 'inline-flex',
    padding: `${(s.padding as number) ?? 4}px`,
  }
})

// 插槽内容样式
const slotContentStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    fontSize: `${(s.slotFontSize as number) ?? 14}px`,
    color: (s.slotColor as string) ?? '#303133',
    padding: `${(s.slotPadding as number) ?? 8}px`,
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
    padding: `${padding}px`,
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
      return {
        ...baseStyle,
        position: 'relative',
      }
  }
})

// 子组件项样式
const getChildItemStyle = (childId: string): CSSProperties => {
  const layout = comp.value?.layout
  const mode = layout?.mode || 'absolute'
  const child = getChildComponent(childId)

  if (mode === 'absolute' && child) {
    // 绝对定位模式：使用子组件的 position
    return {
      position: 'absolute',
      left: `${child.position.x}px`,
      top: `${child.position.y}px`,
      width: `${child.size.width}px`,
      height: `${child.size.height}px`,
    }
  }

  // 其他布局模式：flex/grid 自动布局
  return {}
}

// 子组件内部样式
const getChildComponentStyle = (childId: string): CSSProperties => {
  const layout = comp.value?.layout
  const mode = layout?.mode || 'absolute'
  const child = getChildComponent(childId)

  if (mode !== 'absolute' && child) {
    // 非绝对定位：子组件撑满容器
    return {
      width: '100%',
      height: '100%',
    }
  }

  // 绝对定位：子组件使用自己的尺寸
  return {
    width: '100%',
    height: '100%',
  }
}
</script>

<style scoped>
.badge-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

:deep(.el-badge) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

:deep(.el-badge__content) {
  font-size: inherit !important;
}

.badge-slot-wrapper {
  box-sizing: border-box;
}

.child-item {
  box-sizing: border-box;
}
</style>
