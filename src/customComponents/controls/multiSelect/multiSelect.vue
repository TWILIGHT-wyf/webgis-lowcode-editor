<template>
  <div class="multi-select-container" :style="containerStyle">
    <el-select
      v-model="selectedValues"
      multiple
      :placeholder="placeholder"
      :clearable="clearable"
      :filterable="filterable"
      :disabled="disabled"
      :size="selectSize"
      :collapse-tags="collapseTags"
      :collapse-tags-tooltip="collapseTagsTooltip"
      :max-collapse-tags="maxCollapseTags"
      :multiple-limit="multipleLimit"
      :style="selectStyle"
      @change="handleChange"
    >
      <el-option
        v-for="option in options"
        :key="option.value"
        :label="option.label"
        :value="option.value"
        :disabled="option.disabled"
      />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRef, watch } from 'vue'
import type { CSSProperties } from 'vue'
import { useComponent } from '@/stores/component'
import { storeToRefs } from 'pinia'
import { useDataSource } from '@/datasource/useDataSource'
import { extractWithFallback } from '@/datasource/dataUtils'

interface Option {
  label: string
  value: string | number
  disabled?: boolean
}

const props = defineProps<{ id: string }>()
const { componentStore } = storeToRefs(useComponent())

const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 数据源
const dataSourceRef = toRef(() => comp.value?.dataSource)
const { data: remoteData } = useDataSource(dataSourceRef)

// 选中值
const selectedValues = ref<(string | number)[]>([])

// 监听默认值变化
watch(
  () => comp.value?.props.defaultValue,
  (newVal) => {
    if (Array.isArray(newVal)) {
      selectedValues.value = newVal as (string | number)[]
    }
  },
  { immediate: true },
)

// 选项数据
const options = computed<Option[]>(() => {
  const ds = comp.value?.dataSource
  const localOptions = comp.value?.props.options as Option[] | string

  // 如果启用了数据源
  if (ds?.enabled && remoteData.value) {
    const extracted = extractWithFallback(remoteData.value, ds.dataPath, [])
    if (Array.isArray(extracted)) {
      return extracted.map((item: unknown) => {
        if (typeof item === 'object' && item !== null) {
          const obj = item as Record<string, unknown>
          return {
            label: String(obj[labelField.value] ?? obj.label ?? ''),
            value: (obj[valueField.value] ?? obj.value ?? '') as string | number,
            disabled: Boolean(obj.disabled),
          }
        }
        return { label: String(item), value: String(item) }
      })
    }
  }

  // 本地选项
  if (Array.isArray(localOptions)) return localOptions

  if (typeof localOptions === 'string') {
    return localOptions.split(',').map((s) => {
      const trimmed = s.trim()
      return { label: trimmed, value: trimmed }
    })
  }

  // 默认选项
  return [
    { label: '选项 1', value: '1' },
    { label: '选项 2', value: '2' },
    { label: '选项 3', value: '3' },
    { label: '选项 4', value: '4' },
    { label: '选项 5', value: '5' },
  ]
})

// 配置项
const placeholder = computed(() => (comp.value?.props.placeholder as string) ?? '请选择')
const clearable = computed(() => (comp.value?.props.clearable as boolean) ?? true)
const filterable = computed(() => (comp.value?.props.filterable as boolean) ?? false)
const disabled = computed(() => (comp.value?.props.disabled as boolean) ?? false)
const selectSize = computed(
  () => (comp.value?.props.size as 'large' | 'default' | 'small') ?? 'default',
)
const collapseTags = computed(() => (comp.value?.props.collapseTags as boolean) ?? true)
const collapseTagsTooltip = computed(
  () => (comp.value?.props.collapseTagsTooltip as boolean) ?? true,
)
const maxCollapseTags = computed(() => (comp.value?.props.maxCollapseTags as number) ?? 2)
const multipleLimit = computed(() => (comp.value?.props.multipleLimit as number) ?? 0)
const labelField = computed(() => (comp.value?.props.labelField as string) ?? 'label')
const valueField = computed(() => (comp.value?.props.valueField as string) ?? 'value')

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

const selectStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    width: `${(s.selectWidth as number) ?? 100}%`,
    '--el-input-border-color': (s.borderColor as string) ?? '#dcdfe6',
    '--el-input-focus-border-color': (s.focusBorderColor as string) ?? '#409eff',
    '--el-input-hover-border-color': (s.hoverBorderColor as string) ?? '#c0c4cc',
    '--el-tag-bg-color': (s.tagBackgroundColor as string) ?? '#f0f2f5',
    '--el-tag-text-color': (s.tagTextColor as string) ?? '#606266',
  } as CSSProperties
})

// 事件
function handleChange(value: (string | number)[]) {
  console.log('Multi-select changed:', value)
  // 可以在这里触发自定义事件或更新 store
}
</script>

<style scoped>
.multi-select-container {
  box-sizing: border-box;
}
</style>
