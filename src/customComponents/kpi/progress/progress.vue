<template>
  <VProgress v-bind="progressProps" />
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import { useComponent } from '@/stores/component'
import { storeToRefs } from 'pinia'
import {
  vProgress as VProgress,
  useDataSource,
  extractNumber,
  extractWithFallback,
} from '@one/visual-lib'

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

// 状态
const progressStatus = computed<'' | 'success' | 'exception' | 'warning' | undefined>(() => {
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

// 聚合所有 Props 传递给 Dumb 组件
const progressProps = computed((): Record<string, unknown> => {
  const s = comp.value?.style || {}
  const p = comp.value?.props || {}
  return {
    // 核心数据
    percentage: progressValue.value,
    type: p.type ?? 'line',
    status: progressStatus.value,
    // 进度条配置
    strokeWidth: p.strokeWidth ?? 6,
    textInside: p.textInside ?? false,
    showText: p.showText ?? true,
    showStripe: p.showStripe ?? false,
    animateStripe: p.animateStripe ?? false,
    circleWidth: p.circleWidth ?? 126,
    strokeLinecap: p.strokeLinecap ?? 'round',
    textFormat: p.textFormat ?? '{value}%',
    // 颜色配置
    barColor: s.barColor ?? '#409eff',
    trackColor: s.trackColor ?? '#e5e9f2',
    successColor: s.successColor ?? '#67c23a',
    warningColor: s.warningColor ?? '#e6a23c',
    exceptionColor: s.exceptionColor ?? '#f56c6c',
    useGradient: p.useGradient ?? false,
    // 容器样式
    opacity: s.opacity ?? 100,
    visible: s.visible !== false,
    backgroundColor: s.backgroundColor ?? 'transparent',
    borderColor: s.borderColor ?? 'transparent',
    borderWidth: s.borderWidth ?? 0,
    borderRadius: s.borderRadius ?? 0,
    padding: s.padding ?? 10,
  }
})
</script>
