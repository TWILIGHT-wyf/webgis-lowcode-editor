<template>
  <div :style="containerStyle">
    <el-slider
      v-model="sliderValue"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      :show-stops="showStops"
      :show-tooltip="showTooltip"
      :format-tooltip="formatTooltip"
      :range="range"
      :vertical="vertical"
      :height="height"
      :marks="marksData"
      @change="handleChange"
      @input="handleInput"
    />
    <div v-if="showValue" :style="valueStyle" class="slider-value">
      {{ displayValue }}
    </div>
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
    '--el-slider-main-bg-color': String(s.activeColor || '#409eff'),
    '--el-slider-runway-bg-color': String(s.inactiveColor || '#e4e7ed'),
    '--el-slider-button-size': `${s.buttonSize || 20}px`,
  }
})

const valueStyle = computed(() => {
  const s = comp.value?.style || {}
  const align = String(s.valueAlign || 'center')
  return {
    marginTop: '8px',
    fontSize: `${s.valueFontSize || 14}px`,
    color: String(s.valueColor || '#606266'),
    textAlign:
      align === 'left' || align === 'right' || align === 'center' || align === 'justify'
        ? align
        : 'center',
  } as const
})

// 组件属性
const min = computed(() => comp.value?.props.min ?? 0)
const max = computed(() => comp.value?.props.max ?? 100)
const step = computed(() => comp.value?.props.step ?? 1)
const disabled = computed(() => comp.value?.props.disabled ?? false)
const showStops = computed(() => comp.value?.props.showStops ?? false)
const showTooltip = computed(() => comp.value?.props.showTooltip ?? true)
const range = computed(() => comp.value?.props.range ?? false)
const vertical = computed(() => comp.value?.props.vertical ?? false)
const height = computed(() => comp.value?.props.height || '200px')
const showValue = computed(() => comp.value?.props.showValue ?? true)
const valueFormat = computed(() => comp.value?.props.valueFormat || '{value}')
const defaultValue = computed(() => comp.value?.props.defaultValue)

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

// 滑块值
const sliderValue = ref<number | number[]>(0)

// 监听默认值变化
watch(
  defaultValue,
  (newVal) => {
    if (newVal !== undefined) {
      sliderValue.value = range.value
        ? Array.isArray(newVal)
          ? newVal
          : [0, Number(newVal)]
        : Array.isArray(newVal)
          ? Number(newVal[0])
          : Number(newVal)
    } else {
      sliderValue.value = range.value
        ? [Number(min.value || 0), Number(max.value || 100)]
        : Number(min.value || 0)
    }
  },
  { immediate: true },
)

// 格式化提示
const formatTooltip = (val: number) => {
  const format = String(valueFormat.value || '{value}')
  return format.replace('{value}', String(val))
}

// 显示值
const displayValue = computed(() => {
  if (Array.isArray(sliderValue.value)) {
    return `${sliderValue.value[0]} - ${sliderValue.value[1]}`
  }
  return formatTooltip(sliderValue.value)
})

// 事件处理
const handleChange = (value: number | number[]) => {
  console.log('Slider change:', value)
}

const handleInput = (value: number | number[]) => {
  console.log('Slider input:', value)
}
</script>

<style scoped>
.slider-value {
  margin-top: 8px;
  text-align: v-bind('valueStyle.textAlign');
}

:deep(.el-slider) {
  --el-slider-main-bg-color: v-bind('containerStyle["--el-slider-main-bg-color"]');
  --el-slider-runway-bg-color: v-bind('containerStyle["--el-slider-runway-bg-color"]');
  --el-slider-button-size: v-bind('containerStyle["--el-slider-button-size"]');
}
</style>
