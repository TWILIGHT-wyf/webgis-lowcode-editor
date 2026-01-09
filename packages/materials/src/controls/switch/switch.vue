<template>
  <BaseSwitch v-bind="switchProps" @change="handleChange" />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useComponent } from '@/stores/component'
import { storeToRefs } from 'pinia'
import { vSwitch as BaseSwitch } from '@twi1i9ht/visual-lib'

const props = defineProps<{
  id: string
}>()

const { componentStore } = storeToRefs(useComponent())

// 从 store 获取组件配置
const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 开关值
const switchValue = ref<boolean | string | number>(false)

// 组件属性
const inactiveValue = computed(() => comp.value?.props.inactiveValue ?? false)

// 监听默认值变化
watch(
  () => comp.value?.props.defaultValue,
  (newVal) => {
    if (newVal !== undefined && newVal !== null) {
      switchValue.value = newVal as boolean | string | number
    } else {
      switchValue.value = inactiveValue.value as boolean | string | number
    }
  },
  { immediate: true },
)

// 聚合 props
const switchProps = computed(() => {
  const p = comp.value?.props || {}
  const s = comp.value?.style || {}

  return {
    modelValue: switchValue.value,
    size: p.size || 'default',
    disabled: p.disabled ?? false,
    loading: p.loading ?? false,
    activeText: p.activeText || '',
    inactiveText: p.inactiveText || '',
    activeValue: p.activeValue ?? true,
    inactiveValue: inactiveValue.value,
    inlinePrompt: p.inlinePrompt ?? false,
    activeIcon: p.activeIcon || undefined,
    inactiveIcon: p.inactiveIcon || undefined,
    padding: s.padding || 16,
    backgroundColor: s.backgroundColor || 'transparent',
    activeColor: s.activeColor || '#409eff',
    inactiveColor: s.inactiveColor || '#dcdfe6',
    borderColor: s.borderColor || '#dcdfe6',
  }
})

// 事件处理
const handleChange = (value: boolean | string | number) => {
  switchValue.value = value
  console.log('Switch change:', value)
}
</script>
