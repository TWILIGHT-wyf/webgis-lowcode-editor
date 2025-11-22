<template>
  <div :style="containerStyle">
    <el-switch
      v-model="switchValue"
      :size="size"
      :disabled="disabled"
      :loading="loading"
      :active-text="activeText"
      :inactive-text="inactiveText"
      :active-value="activeValue"
      :inactive-value="inactiveValue"
      :inline-prompt="inlinePrompt"
      :active-icon="activeIcon"
      :inactive-icon="inactiveIcon"
      @change="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useComponent } from '@/stores/component'
import { storeToRefs } from 'pinia'

const props = defineProps<{
  id: string
}>()

const { componentStore } = storeToRefs(useComponent())

// 从 store 获取组件配置
const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 样式
const containerStyle = computed(() => {
  const s = comp.value?.style || {}
  return {
    padding: `${s.padding || 16}px`,
    backgroundColor: String(s.backgroundColor || 'transparent'),
    '--el-switch-on-color': String(s.activeColor || '#409eff'),
    '--el-switch-off-color': String(s.inactiveColor || '#dcdfe6'),
    '--el-switch-border-color': String(s.borderColor || '#dcdfe6'),
  }
})

// 组件属性
const size = computed(() => comp.value?.props.size || 'default')
const disabled = computed(() => comp.value?.props.disabled ?? false)
const loading = computed(() => comp.value?.props.loading ?? false)
const activeText = computed(() => comp.value?.props.activeText || '')
const inactiveText = computed(() => comp.value?.props.inactiveText || '')
const activeValue = computed(() => comp.value?.props.activeValue ?? true)
const inactiveValue = computed(() => comp.value?.props.inactiveValue ?? false)
const inlinePrompt = computed(() => comp.value?.props.inlinePrompt ?? false)
const activeIcon = computed(() => comp.value?.props.activeIcon || undefined)
const inactiveIcon = computed(() => comp.value?.props.inactiveIcon || undefined)
const defaultValue = computed(() => comp.value?.props.defaultValue)

// 开关值
const switchValue = ref<boolean | string | number>(false)

// 监听默认值变化
watch(
  defaultValue,
  (newVal) => {
    if (newVal !== undefined && newVal !== null) {
      switchValue.value = newVal as boolean | string | number
    } else {
      switchValue.value = inactiveValue.value as boolean | string | number
    }
  },
  { immediate: true },
)

// 事件处理
const handleChange = (value: boolean | string | number) => {
  console.log('Switch change:', value)
}
</script>

<style scoped>
:deep(.el-switch) {
  --el-switch-on-color: v-bind('containerStyle["--el-switch-on-color"]');
  --el-switch-off-color: v-bind('containerStyle["--el-switch-off-color"]');
  --el-switch-border-color: v-bind('containerStyle["--el-switch-border-color"]');
}
</style>
