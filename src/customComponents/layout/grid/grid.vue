<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useComponent } from '@/stores/component'
import { useLayoutHelpers } from '@/customComponents/layout/layoutUtils'
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

// 子组件相关（使用共享 composable）
const {
  hasChildren,
  getChildComponent,
  getComponentByType,
  childrenContainerStyle,
  getChildItemStyle,
  getChildComponentStyle,
} = useLayoutHelpers(comp)
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
