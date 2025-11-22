<template>
  <div :style="containerStyle">
    <el-checkbox-group
      v-model="checkboxValue"
      :size="size"
      :disabled="disabled"
      :min="min"
      :max="max"
      @change="handleChange"
    >
      <component
        :is="layout === 'button' ? 'el-checkbox-button' : 'el-checkbox'"
        v-for="option in options"
        :key="option.value"
        :label="option.value"
        :disabled="option.disabled"
        :border="showBorder && layout !== 'button'"
      >
        {{ option.label }}
      </component>
    </el-checkbox-group>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRef, watch } from 'vue'
import { useComponent } from '@/stores/component'
import { storeToRefs } from 'pinia'
import { useDataSource } from '@/datasource/useDataSource'
import { extractWithFallback } from '@/datasource/dataUtils'

const props = defineProps<{
  id: string
}>()

const { componentStore } = storeToRefs(useComponent())

// 从 store 获取组件配置
const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 数据源
const dataSourceRef = toRef(() => comp.value?.dataSource)
const { data: remoteData } = useDataSource(dataSourceRef)

// 样式
const containerStyle = computed(() => {
  const s = comp.value?.style || {}
  return {
    padding: `${s.padding || 16}px`,
    backgroundColor: String(s.backgroundColor || 'transparent'),
    display: 'flex',
    flexDirection: (String(s.direction || 'horizontal') === 'vertical' ? 'column' : 'row') as
      | 'column'
      | 'row',
    gap: `${s.gap || 12}px`,
    '--el-checkbox-checked-bg-color': String(s.checkedColor || '#409eff'),
    '--el-checkbox-checked-input-border-color': String(s.checkedColor || '#409eff'),
    '--el-checkbox-input-border-color': String(s.borderColor || '#dcdfe6'),
    '--el-checkbox-text-color': String(s.textColor || '#606266'),
  }
})

// 组件属性
const size = computed(() => comp.value?.props.size || 'default')
const disabled = computed(() => comp.value?.props.disabled ?? false)
const min = computed(() => comp.value?.props.min || undefined)
const max = computed(() => comp.value?.props.max || undefined)
const layout = computed(() => comp.value?.props.layout || 'default')
const showBorder = computed(() => comp.value?.props.showBorder ?? false)
const defaultValue = computed(() => comp.value?.props.defaultValue || '')
const labelField = computed(() => comp.value?.props.labelField || 'label')
const valueField = computed(() => comp.value?.props.valueField || 'value')

// 选项接口
interface Option {
  label: string
  value: string | number
  disabled?: boolean
}

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
          const labelKey = String(labelField.value || 'label')
          const valueKey = String(valueField.value || 'value')
          return {
            label: String(obj[labelKey] ?? obj.label ?? ''),
            value: (obj[valueKey] ?? obj.value ?? '') as string | number,
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

  return []
})

// 复选框值
const checkboxValue = ref<(string | number)[]>([])

// 监听默认值变化
watch(
  defaultValue,
  (newVal) => {
    if (newVal) {
      if (typeof newVal === 'string') {
        checkboxValue.value = newVal.split(',').map((s) => s.trim())
      } else if (Array.isArray(newVal)) {
        checkboxValue.value = newVal
      }
    }
  },
  { immediate: true },
)

// 事件处理
const handleChange = (value: (string | number)[]) => {
  console.log('CheckboxGroup change:', value)
}
</script>

<style scoped>
:deep(.el-checkbox-group) {
  display: flex;
  flex-direction: v-bind('containerStyle.flexDirection');
  gap: v-bind('containerStyle.gap');
}

:deep(.el-checkbox) {
  --el-checkbox-checked-bg-color: v-bind('containerStyle["--el-checkbox-checked-bg-color"]');
  --el-checkbox-checked-input-border-color: v-bind(
    'containerStyle["--el-checkbox-checked-input-border-color"]'
  );
  --el-checkbox-input-border-color: v-bind('containerStyle["--el-checkbox-input-border-color"]');
  --el-checkbox-text-color: v-bind('containerStyle["--el-checkbox-text-color"]');
}

:deep(.el-checkbox-button) {
  --el-checkbox-button-checked-bg-color: v-bind('containerStyle["--el-checkbox-checked-bg-color"]');
  --el-checkbox-button-checked-border-color: v-bind(
    'containerStyle["--el-checkbox-checked-input-border-color"]'
  );
}
</style>
