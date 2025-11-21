<template>
  <div class="badge-container" :style="containerStyle">
    <span class="badge-content" :style="contentStyle">{{ processedValue }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import type { CSSProperties } from 'vue'
import { useComponent } from '@/stores/component'
import { storeToRefs } from 'pinia'
import { useDataSource } from '@/datasource/useDataSource'
import { extractWithFallback } from '@/datasource/dataUtils'

const props = defineProps<{ id: string }>()
const { componentStore } = storeToRefs(useComponent())

const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 数据源
const dataSourceRef = toRef(() => comp.value?.dataSource)
const { data: remoteData } = useDataSource(dataSourceRef)

// 显示值
const displayValue = computed<string | number>(() => {
  const ds = comp.value?.dataSource
  const localValue = (comp.value?.props.value as string | number) ?? ''

  if (ds?.enabled && remoteData.value) {
    return extractWithFallback(remoteData.value, ds.valuePath, localValue) as string | number
  }
  return localValue
})

// 组件属性
const type = computed<string>(() => (comp.value?.props.type as string) ?? 'primary')
const dot = computed<boolean>(() => (comp.value?.props.dot as boolean) ?? false)
const maxValue = computed<number>(() => (comp.value?.props.maxValue as number) ?? 99)

// 处理显示值
const processedValue = computed(() => {
  if (dot.value) return ''
  const val = displayValue.value
  if (typeof val === 'number' && val > maxValue.value) {
    return `${maxValue.value}+`
  }
  return val
})

// 样式
const containerStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    opacity: ((s.opacity ?? 100) as number) / 100,
    display: s.visible === false ? 'none' : 'inline-flex',
    padding: `${(s.padding as number) ?? 4}px`,
  }
})

const contentStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}

  // 根据类型设置默认颜色
  let bgColor = (s.backgroundColor as string) ?? '#409eff'
  const badgeType = type.value
  if (badgeType === 'success') bgColor = (s.successColor as string) ?? '#67c23a'
  else if (badgeType === 'warning') bgColor = (s.warningColor as string) ?? '#e6a23c'
  else if (badgeType === 'danger') bgColor = (s.dangerColor as string) ?? '#f56c6c'
  else if (badgeType === 'info') bgColor = (s.infoColor as string) ?? '#909399'

  const isDot = dot.value

  return {
    backgroundColor: bgColor,
    color: (s.textColor as string) ?? '#fff',
    fontSize: isDot ? '0' : `${(s.fontSize as number) ?? 12}px`,
    fontWeight: (s.fontWeight as string) ?? 'bold',
    padding: isDot ? '0' : `${(s.paddingY as number) ?? 2}px ${(s.paddingX as number) ?? 6}px`,
    borderRadius: isDot ? '50%' : `${(s.borderRadius as number) ?? 10}px`,
    minWidth: isDot ? '8px' : '20px',
    height: isDot ? '8px' : 'auto',
    lineHeight: isDot ? '0' : '1',
    textAlign: 'center' as const,
    whiteSpace: 'nowrap' as const,
    border: `${(s.borderWidth as number) ?? 0}px solid ${(s.borderColor as string) ?? 'transparent'}`,
    boxShadow: (s.boxShadow as string) ?? 'none',
  }
})
</script>

<style scoped>
.badge-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.badge-content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
</style>
