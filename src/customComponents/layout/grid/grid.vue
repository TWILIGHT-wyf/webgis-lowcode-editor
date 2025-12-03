<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'
import { storeToRefs } from 'pinia'
import { useComponent } from '@/stores/component'
import { vGrid as BaseGrid } from '@one/visual-lib'
import { componentRegistry } from '@/customComponents/registry'
import Shape from '@/components/Editor/shape/shape.vue'

const props = defineProps<{
  id: string
}>()

const { componentStore } = storeToRefs(useComponent())

const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 聚合所有 Props 传递给 Base 组件
const gridProps = computed((): Record<string, unknown> => {
  const s = comp.value?.style || {}
  const p = comp.value?.props || {}
  return {
    // Grid 布局属性
    gridTemplateColumns: s.gridTemplateColumns ?? 'repeat(3, 1fr)',
    gridTemplateRows: s.gridTemplateRows ?? 'auto',
    gridGap: s.gridGap ?? 16,
    gridAutoFlow: s.gridAutoFlow ?? 'row',
    // 容器样式
    padding: s.padding ?? 16,
    backgroundColor: s.backgroundColor ?? '#ffffff',
    border: s.border ?? '1px solid #e5e7eb',
    borderRadius: s.borderRadius ?? 4,
    minHeight: s.minHeight ?? 200,
    textColor: s.textColor ?? '#333333',
    // 占位内容（仅当没有子组件时显示）
    content: hasChildren.value ? undefined : (p.content ?? undefined),
    placeholderItems: hasChildren.value ? [] : undefined,
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
const getChildComponentStyle = (_childId: string): CSSProperties => {
  return {
    width: '100%',
    height: '100%',
  }
}
</script>

<template>
  <BaseGrid v-bind="gridProps">
    <!-- 子组件渲染 -->
    <template v-if="hasChildren">
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
    </template>
  </BaseGrid>
</template>

<style scoped>
.child-item {
  box-sizing: border-box;
}
</style>
