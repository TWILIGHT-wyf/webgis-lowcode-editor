<template>
  <el-row :gutter="gutter" :justify="justify" :align="align" :tag="tag" :style="containerStyle">
    <div class="row-content" :style="contentStyle">
      {{ content || '行布局容器 - 可拖入其他组件' }}
    </div>
  </el-row>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useComponent } from '@/stores/component'
import { storeToRefs } from 'pinia'

const props = defineProps<{ id: string }>()
const { componentStore } = storeToRefs(useComponent())

const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 样式
const containerStyle = computed(() => {
  const s = comp.value?.style || {}
  return {
    padding: `${s.padding || 0}px`,
    backgroundColor: String(s.backgroundColor || 'transparent'),
    borderRadius: `${s.borderRadius || 0}px`,
    borderWidth: `${s.borderWidth || 0}px`,
    borderStyle: s.borderWidth ? 'solid' : 'none',
    borderColor: String(s.borderColor || '#dcdfe6'),
    minHeight: String(s.minHeight || 'auto'),
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
const gutter = computed(() => Number(comp.value?.props.gutter || 0))
const justify = computed(() => String(comp.value?.props.justify || 'start'))
const align = computed(() => String(comp.value?.props.align || 'top'))
const tag = computed(() => String(comp.value?.props.tag || 'div'))
const content = computed(() => String(comp.value?.props.content || ''))
</script>

<style scoped>
.row-content {
  width: 100%;
  min-height: 50px;
}

:deep(.el-row) {
  width: 100%;
}
</style>
