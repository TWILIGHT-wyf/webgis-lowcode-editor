<template>
  <div class="v-progress-container" :style="containerStyle">
    <el-progress
      :percentage="percentage"
      :type="type"
      :status="status"
      :stroke-width="strokeWidth"
      :text-inside="textInside"
      :show-text="showText"
      :color="computedColor"
      :format="formatText"
      :width="circleWidth"
      :stroke-linecap="strokeLinecap"
      :define-back-color="trackColor"
      :striped="showStripe"
      :striped-flow="animateStripe"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'

// 颜色配置类型
interface ColorStop {
  color: string
  percentage: number
}

// 定义纯 UI Props，无业务逻辑
const props = defineProps<{
  // 核心数据
  percentage?: number
  type?: 'line' | 'circle' | 'dashboard'
  status?: '' | 'success' | 'exception' | 'warning'

  // 进度条配置
  strokeWidth?: number
  textInside?: boolean
  showText?: boolean
  showStripe?: boolean
  animateStripe?: boolean
  circleWidth?: number
  strokeLinecap?: 'butt' | 'round' | 'square'
  textFormat?: string

  // 颜色配置
  barColor?: string
  trackColor?: string
  successColor?: string
  warningColor?: string
  exceptionColor?: string
  useGradient?: boolean

  // 容器样式
  opacity?: number
  visible?: boolean
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
  borderRadius?: number
  padding?: number
}>()

// 计算颜色
const computedColor = computed<string | ColorStop[]>(() => {
  const barColor = props.barColor ?? '#409eff'
  const successColor = props.successColor ?? '#67c23a'
  const warningColor = props.warningColor ?? '#e6a23c'
  const exceptionColor = props.exceptionColor ?? '#f56c6c'

  // 根据状态返回对应颜色
  if (props.status) {
    if (props.status === 'success') return successColor
    if (props.status === 'warning') return warningColor
    if (props.status === 'exception') return exceptionColor
  }

  // 使用渐变色
  if (props.useGradient) {
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
  const format = props.textFormat ?? '{value}%'
  return format.replace('{value}', percentage.toFixed(0))
}

// 容器样式
const containerStyle = computed<CSSProperties>(() => {
  return {
    opacity: ((props.opacity ?? 100) as number) / 100,
    display: props.visible === false ? 'none' : 'flex',
    backgroundColor: props.backgroundColor ?? 'transparent',
    borderColor: props.borderColor ?? 'transparent',
    borderWidth: `${props.borderWidth ?? 0}px`,
    borderStyle: 'solid',
    borderRadius: `${props.borderRadius ?? 0}px`,
    padding: `${props.padding ?? 10}px`,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
  }
})
</script>

<style scoped>
.v-progress-container {
  box-sizing: border-box;
}

:deep(.el-progress) {
  width: 100%;
}

:deep(.el-progress__text) {
  font-size: inherit !important;
}
</style>
