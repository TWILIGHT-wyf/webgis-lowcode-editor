<template>
  <BaseSlider v-bind="sliderProps" @change="handleChange" @input="handleInput" />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useComponent } from '@vela/editor/stores/component'
import { storeToRefs } from 'pinia'
import { vSlider as BaseSlider } from '@vela/ui'

const props = defineProps<{
  id: string
}>()

const { componentStore } = storeToRefs(useComponent())

// 从 store 获取组件配置
const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 组件属性
const range = computed(() => comp.value?.props.range ?? false)
const min = computed(() => comp.value?.props.min ?? 0)
const max = computed(() => comp.value?.props.max ?? 100)

// 滑块值
const sliderValue = ref<number | number[]>(0)

// 监听默认值变化
watch(
  () => comp.value?.props.defaultValue,
  (newVal) => {
    if (newVal !== undefined) {
      sliderValue.value = range.value
        ? Array.isArray(newVal)
          ? (newVal.map((v: unknown) => Number(v)) as number[])
          : [0, Number(newVal)]
        : Array.isArray(newVal)
          ? Number((newVal as unknown[])[0])
          : Number(newVal)
    } else {
      sliderValue.value = range.value
        ? [Number(min.value || 0), Number(max.value || 100)]
        : Number(min.value || 0)
    }
  },
  { immediate: true },
)

// 标记点
const marksData = computed(() => {
  const marksStr = comp.value?.props.marks
  if (!marksStr) return undefined

  try {
    return typeof marksStr === 'string' ? JSON.parse(marksStr) : marksStr
  } catch {
    return undefined
  }
})

// 聚合 props
const sliderProps = computed(() => {
  const p = comp.value?.props || {}
  const s = comp.value?.style || {}

  return {
    modelValue: sliderValue.value,
    min: min.value,
    max: max.value,
    step: p.step ?? 1,
    disabled: p.disabled ?? false,
    showStops: p.showStops ?? false,
    showTooltip: p.showTooltip ?? true,
    range: range.value,
    vertical: p.vertical ?? false,
    height: p.height || '200px',
    marks: marksData.value,
    showValue: p.showValue ?? true,
    valueFormat: p.valueFormat || '{value}',
    padding: s.padding || 16,
    backgroundColor: s.backgroundColor || 'transparent',
    activeColor: s.activeColor || '#409eff',
    inactiveColor: s.inactiveColor || '#e4e7ed',
    buttonSize: s.buttonSize || 20,
    valueFontSize: s.valueFontSize || 14,
    valueColor: s.valueColor || '#606266',
    valueAlign: s.valueAlign || 'center',
  }
})

// 事件处理
const handleChange = (value: number | number[]) => {
  sliderValue.value = value
  console.log('Slider change:', value)
}

const handleInput = (value: number | number[]) => {
  console.log('Slider input:', value)
}
</script>
