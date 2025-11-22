<template>
  <el-col
    :span="span"
    :offset="offset"
    :push="push"
    :pull="pull"
    :xs="xs"
    :sm="sm"
    :md="md"
    :lg="lg"
    :xl="xl"
    :tag="tag"
    :style="containerStyle"
  >
    <div class="col-content" :style="contentStyle">
      {{ content || '列布局容器 - 可拖入其他组件' }}
    </div>
  </el-col>
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
const span = computed(() => Number(comp.value?.props.span || 24))
const offset = computed(() => Number(comp.value?.props.offset || 0))
const push = computed(() => Number(comp.value?.props.push || 0))
const pull = computed(() => Number(comp.value?.props.pull || 0))
const xs = computed(() => comp.value?.props.xs || undefined)
const sm = computed(() => comp.value?.props.sm || undefined)
const md = computed(() => comp.value?.props.md || undefined)
const lg = computed(() => comp.value?.props.lg || undefined)
const xl = computed(() => comp.value?.props.xl || undefined)
const tag = computed(() => String(comp.value?.props.tag || 'div'))
const content = computed(() => String(comp.value?.props.content || ''))
</script>

<style scoped>
.col-content {
  width: 100%;
  min-height: 50px;
}

:deep(.el-col) {
  width: 100%;
}
</style>
