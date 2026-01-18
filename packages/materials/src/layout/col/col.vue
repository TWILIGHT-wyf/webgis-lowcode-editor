<template>
  <BaseCol v-bind="colProps">
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
  </BaseCol>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useComponent } from '@vela/editor/stores/component'
import { storeToRefs } from 'pinia'
import { vCol as BaseCol } from '@vela/ui'
import { useLayoutHelpers } from '@vela/materials/layout/layoutUtils'
import Shape from '@vela/editor/components/Canvas/modes/Free/Shape/Shape.vue'

const props = defineProps<{ id: string }>()
const { componentStore } = storeToRefs(useComponent())

const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 聚合所有 Props 传递给 Base 组件
const colProps = computed((): Record<string, unknown> => {
  const s = comp.value?.style || {}
  const p = comp.value?.props || {}
  return {
    // Col 属性
    span: Number(p.span || 24),
    offset: Number(p.offset || 0),
    push: Number(p.push || 0),
    pull: Number(p.pull || 0),
    xs: p.xs || undefined,
    sm: p.sm || undefined,
    md: p.md || undefined,
    lg: p.lg || undefined,
    xl: p.xl || undefined,
    tag: String(p.tag || 'div'),
    content: String(p.content || ''),
    // 容器样式
    padding: s.padding ?? 0,
    backgroundColor: s.backgroundColor ?? 'transparent',
    borderRadius: s.borderRadius ?? 0,
    borderWidth: s.borderWidth ?? 0,
    borderColor: s.borderColor ?? '#dcdfe6',
    minHeight: s.minHeight ?? 'auto',
    textColor: s.textColor ?? '#909399',
    fontSize: s.fontSize ?? 14,
    // 子组件状态
    hasChildren: hasChildren.value,
  }
})

// 子组件相关（使用共享 composable）
const {
  hasChildren,
  getChildComponent,
  getComponentByType,
  getChildItemStyle,
  getChildComponentStyle,
} = useLayoutHelpers(comp)
</script>

<style scoped>
.child-item {
  box-sizing: border-box;
}
</style>
