<template>
  <div :style="containerStyle">
    <el-button-group>
      <el-button
        v-for="button in buttons"
        :key="button.value"
        :type="button.type || type"
        :size="size"
        :disabled="button.disabled || disabled"
        :plain="plain"
        :round="round"
        :circle="circle"
        :icon="button.icon"
        @click="handleClick(button)"
      >
        {{ button.label }}
      </el-button>
    </el-button-group>
  </div>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
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
  }
})

// 组件属性
const type = computed(() => comp.value?.props.type || 'default')
const size = computed(() => comp.value?.props.size || 'default')
const disabled = computed(() => comp.value?.props.disabled ?? false)
const plain = computed(() => comp.value?.props.plain ?? false)
const round = computed(() => comp.value?.props.round ?? false)
const circle = computed(() => comp.value?.props.circle ?? false)
const labelField = computed(() => comp.value?.props.labelField || 'label')
const valueField = computed(() => comp.value?.props.valueField || 'value')

// 按钮接口
interface Button {
  label: string
  value: string | number
  type?: 'default' | 'primary' | 'success' | 'warning' | 'info' | 'danger'
  icon?: string
  disabled?: boolean
}

// 按钮数据
const buttons = computed<Button[]>(() => {
  const ds = comp.value?.dataSource
  const localButtons = comp.value?.props.buttons as Button[] | string

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
            type: (obj.type as Button['type']) || undefined,
            icon: obj.icon ? String(obj.icon) : undefined,
            disabled: Boolean(obj.disabled),
          }
        }
        return { label: String(item), value: String(item) }
      })
    }
  }

  // 本地按钮
  if (Array.isArray(localButtons)) return localButtons

  if (typeof localButtons === 'string') {
    return localButtons.split(',').map((s) => {
      const trimmed = s.trim()
      return { label: trimmed, value: trimmed }
    })
  }

  return []
})

// 事件处理
const handleClick = (button: Button) => {
  console.log('Button clicked:', button)
}
</script>

<style scoped>
:deep(.el-button-group) {
  display: flex;
}
</style>
