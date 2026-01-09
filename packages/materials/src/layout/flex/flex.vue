<template>
  <BaseFlex v-bind="flexProps">
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
  </BaseFlex>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'
import { useComponent } from '@/stores/component'
import { storeToRefs } from 'pinia'
import { vFlex as BaseFlex } from '@twi1i9ht/visual-lib'
import { componentRegistry } from '@/customComponents/registry'
import Shape from '@/components/Editor/shape/shape.vue'

const props = defineProps<{ id: string }>()
const { componentStore } = storeToRefs(useComponent())

const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 聚合所有 Props 传递给 Base 组件
const flexProps = computed((): Record<string, unknown> => {
  const s = comp.value?.style || {}
  const p = comp.value?.props || {}
  return {
    // Flex 布局属性
    flexDirection: s.flexDirection ?? 'row',
    justifyContent: s.justifyContent ?? 'flex-start',
    alignItems: s.alignItems ?? 'stretch',
    flexWrap: s.flexWrap ?? 'nowrap',
    gap: s.gap ?? 0,
    // 容器样式
    padding: s.padding ?? 16,
    backgroundColor: s.backgroundColor ?? 'transparent',
    borderRadius: s.borderRadius ?? 0,
    borderWidth: s.borderWidth ?? 0,
    borderColor: s.borderColor ?? '#dcdfe6',
    minHeight: s.minHeight ?? '100px',
    // 占位文本（仅当没有子组件时显示）
    placeholder: hasChildren.value ? undefined : (p.content ?? 'Flex弹性布局容器 - 可拖入其他组件'),
    textColor: s.textColor ?? '#909399',
    fontSize: s.fontSize ?? 14,
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getChildComponentStyle = (_childId: string): CSSProperties => {
  return {
    width: '100%',
    height: '100%',
  }
}
</script>

<style scoped>
.child-item {
  box-sizing: border-box;
}
</style>
