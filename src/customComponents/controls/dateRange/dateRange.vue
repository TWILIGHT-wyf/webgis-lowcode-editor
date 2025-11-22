<template>
  <div class="date-range-container" :style="containerStyle">
    <el-date-picker
      v-model="dateRange"
      type="daterange"
      :range-separator="rangeSeparator"
      :start-placeholder="startPlaceholder"
      :end-placeholder="endPlaceholder"
      :format="format"
      :value-format="valueFormat"
      :disabled="disabled"
      :clearable="clearable"
      :size="pickerSize"
      :editable="editable"
      :shortcuts="shortcuts"
      :style="pickerStyle"
      @change="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { CSSProperties } from 'vue'
import { useComponent } from '@/stores/component'
import { storeToRefs } from 'pinia'

const props = defineProps<{ id: string }>()
const { componentStore } = storeToRefs(useComponent())

const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 日期范围值
const dateRange = ref<[Date, Date] | null>(null)

// 监听默认值变化
watch(
  () => comp.value?.props.defaultValue,
  (newVal) => {
    if (Array.isArray(newVal) && newVal.length === 2) {
      dateRange.value = [new Date(newVal[0] as string), new Date(newVal[1] as string)]
    }
  },
  { immediate: true },
)

// 配置项
const rangeSeparator = computed(() => (comp.value?.props.rangeSeparator as string) ?? '至')
const startPlaceholder = computed(
  () => (comp.value?.props.startPlaceholder as string) ?? '开始日期',
)
const endPlaceholder = computed(() => (comp.value?.props.endPlaceholder as string) ?? '结束日期')
const format = computed(() => (comp.value?.props.format as string) ?? 'YYYY-MM-DD')
const valueFormat = computed(() => (comp.value?.props.valueFormat as string) ?? 'YYYY-MM-DD')
const disabled = computed(() => (comp.value?.props.disabled as boolean) ?? false)
const clearable = computed(() => (comp.value?.props.clearable as boolean) ?? true)
const pickerSize = computed(
  () => (comp.value?.props.size as 'large' | 'default' | 'small') ?? 'default',
)
const editable = computed(() => (comp.value?.props.editable as boolean) ?? false)
const enableShortcuts = computed(() => (comp.value?.props.enableShortcuts as boolean) ?? true)

// 快捷选项
const shortcuts = computed(() => {
  if (!enableShortcuts.value) return []

  return [
    {
      text: '最近一周',
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        return [start, end]
      },
    },
    {
      text: '最近一个月',
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        return [start, end]
      },
    },
    {
      text: '最近三个月',
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        return [start, end]
      },
    },
    {
      text: '本月',
      value: () => {
        const now = new Date()
        const start = new Date(now.getFullYear(), now.getMonth(), 1)
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        return [start, end]
      },
    },
    {
      text: '本年',
      value: () => {
        const now = new Date()
        const start = new Date(now.getFullYear(), 0, 1)
        const end = new Date(now.getFullYear(), 11, 31)
        return [start, end]
      },
    },
  ]
})

// 样式
const containerStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    opacity: ((s.opacity ?? 100) as number) / 100,
    display: s.visible === false ? 'none' : 'flex',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    padding: `${(s.padding as number) ?? 8}px`,
    backgroundColor: (s.backgroundColor as string) ?? 'transparent',
    borderRadius: `${(s.borderRadius as number) ?? 4}px`,
  }
})

const pickerStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    width: `${(s.pickerWidth as number) ?? 100}%`,
    '--el-input-border-color': (s.borderColor as string) ?? '#dcdfe6',
    '--el-input-focus-border-color': (s.focusBorderColor as string) ?? '#409eff',
    '--el-input-hover-border-color': (s.hoverBorderColor as string) ?? '#c0c4cc',
  } as CSSProperties
})

// 事件
function handleChange(value: [Date, Date] | null) {
  console.log('Date range changed:', value)
  // 可以在这里触发自定义事件或更新 store
}
</script>

<style scoped>
.date-range-container {
  box-sizing: border-box;
}
</style>
