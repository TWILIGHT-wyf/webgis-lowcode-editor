<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useComponent } from '@/stores/component'

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
</script>

<template>
  <div :style="containerStyle">
    <template v-if="comp?.props?.content">
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
