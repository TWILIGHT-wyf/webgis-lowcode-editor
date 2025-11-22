<template>
  <div class="progress-container" :style="containerStyle">
    <!-- 使用 Element Plus Progress 组件 -->
    <el-progress
      :percentage="progressValue"
      :type="progressType"
      :status="status"
      :stroke-width="strokeWidth"
      :text-inside="textInside"
      :show-text="showText"
      :color="customColors"
      :format="formatText"
      :width="circleWidth"
      :stroke-linecap="strokeLinecap"
      :define-back-color="defineBackColor"
      :striped="showStripe"
      :striped-flow="animateStripe"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import type { CSSProperties } from 'vue'
import { useComponent } from '@/stores/component'
import { storeToRefs } from 'pinia'
import { useDataSource } from '@/datasource/useDataSource'
import { extractNumber, extractWithFallback } from '@/datasource/dataUtils'

const props = defineProps<{ id: string }>()
const { componentStore } = storeToRefs(useComponent())

const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 数据源
const dataSourceRef = toRef(() => comp.value?.dataSource)
const { data: remoteData } = useDataSource(dataSourceRef)

// 进度值
const progressValue = computed<number>(() => {
  const ds = comp.value?.dataSource
  const localValue = (comp.value?.props.value as number) ?? 0

  let val = localValue
  if (ds?.enabled && remoteData.value) {
    val = extractNumber(remoteData.value, ds.valuePath, localValue)
  }

  return Math.max(0, Math.min(100, val)) // 限制在0-100之间
})

// 组件属性
const progressType = computed(() => {
  const type = (comp.value?.props.type as string) ?? 'line'
  return type as 'line' | 'circle' | 'dashboard'
})

const status = computed<'' | 'success' | 'exception' | 'warning' | undefined>(() => {
  const ds = comp.value?.dataSource
  let statusValue = (comp.value?.props.status as string) ?? ''
  if (ds?.enabled && remoteData.value && ds.statusPath && typeof ds.statusPath === 'string') {
    statusValue = extractWithFallback(
      remoteData.value,
      ds.statusPath as string,
      statusValue,
    ) as string
  }
  return (statusValue || undefined) as '' | 'success' | 'exception' | 'warning' | undefined
})

const strokeWidth = computed<number>(() => (comp.value?.props.strokeWidth as number) ?? 6)
const textInside = computed<boolean>(() => (comp.value?.props.textInside as boolean) ?? false)
const showText = computed<boolean>(() => (comp.value?.props.showText as boolean) ?? true)
const showStripe = computed<boolean>(() => (comp.value?.props.showStripe as boolean) ?? false)
const animateStripe = computed<boolean>(() => (comp.value?.props.animateStripe as boolean) ?? false)
const circleWidth = computed<number>(() => (comp.value?.props.circleWidth as number) ?? 126)
const strokeLinecap = computed<'butt' | 'round' | 'square'>(
  () => (comp.value?.props.strokeLinecap as 'butt' | 'round' | 'square') ?? 'round',
)
const defineBackColor = computed<string>(
  () => (comp.value?.style.trackColor as string) ?? '#e5e9f2',
)
const textFormat = computed<string>(() => (comp.value?.props.textFormat as string) ?? '{value}%')

// 自定义颜色
const customColors = computed(() => {
  const s = comp.value?.style || {}
  const barColor = (s.barColor as string) ?? '#409eff'
  const successColor = (s.successColor as string) ?? '#67c23a'
  const warningColor = (s.warningColor as string) ?? '#e6a23c'
  const exceptionColor = (s.exceptionColor as string) ?? '#f56c6c'

  if (status.value) {
    if (status.value === 'success') return successColor
    if (status.value === 'warning') return warningColor
    if (status.value === 'exception') return exceptionColor
  }

  const useGradient = (comp.value?.props.useGradient as boolean) ?? false
  if (useGradient) {
    return [
      { color: exceptionColor, percentage: 20 },
      { color: warningColor, percentage: 50 },
      { color: successColor, percentage: 100 },
    ]
  }

  return barColor
})

// 格式化文本
const formatText = (percentage: number) => {
  return textFormat.value.replace('{value}', percentage.toFixed(0))
}

// 样式
const containerStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    opacity: ((s.opacity ?? 100) as number) / 100,
    display: s.visible === false ? 'none' : 'flex',
    backgroundColor: (s.backgroundColor as string) ?? 'transparent',
    borderColor: (s.borderColor as string) ?? 'transparent',
    borderWidth: `${(s.borderWidth as number) ?? 0}px`,
    borderStyle: 'solid',
    borderRadius: `${(s.borderRadius as number) ?? 0}px`,
    padding: `${(s.padding as number) ?? 10}px`,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  }
})
</script>

<style scoped>
.progress-container {
  box-sizing: border-box;
}

:deep(.el-progress) {
  width: 100%;
}

:deep(.el-progress__text) {
  font-size: inherit !important;
}
</style>
