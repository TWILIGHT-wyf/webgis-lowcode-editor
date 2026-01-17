<template>
  <div class="v-stat-card" :style="cardStyle">
    <div class="v-stat-header">
      <div class="v-stat-title" :style="titleStyleComputed">{{ title }}</div>
    </div>
    <div class="v-stat-body">
      <div v-if="icon" class="v-stat-icon" :style="iconStyle">
        <i :class="icon"></i>
      </div>
      <div class="v-stat-value" :style="valueStyleComputed">{{ formattedValue }}{{ suffix }}</div>
    </div>
    <div v-if="showChange && (change ?? 0) !== 0" class="v-stat-footer">
      <span class="v-stat-change" :style="changeStyleComputed">
        {{ (change ?? 0) > 0 ? '+' : '' }}{{ (change ?? 0).toFixed(1) }}%
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'

// 定义纯 UI Props，无业务逻辑
const props = defineProps<{
  // 数据
  title?: string
  value?: number
  change?: number
  suffix?: string
  icon?: string
  precision?: number
  showChange?: boolean

  // 卡片样式
  opacity?: number
  visible?: boolean
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
  borderRadius?: number
  boxShadow?: string
  padding?: number

  // 标题样式
  titleColor?: string
  titleFontSize?: number
  titleFontWeight?: 'normal' | 'bold' | 'lighter' | number

  // 数值样式
  valueColor?: string
  valueFontSize?: number
  valueFontWeight?: 'normal' | 'bold' | 'lighter' | number

  // 变化率样式
  changeFontSize?: number
  changeFontWeight?: 'normal' | 'bold' | 'lighter' | number
  changeColorPositive?: string
  changeColorNegative?: string

  // 图标样式
  iconColor?: string
  iconSize?: number
}>()

// 格式化显示值
const formattedValue = computed(() => {
  const val = props.value ?? 0
  const prec = props.precision ?? 0
  return val.toLocaleString(undefined, {
    minimumFractionDigits: prec,
    maximumFractionDigits: prec,
  })
})

// 卡片样式
const cardStyle = computed<CSSProperties>(() => {
  return {
    opacity: ((props.opacity ?? 100) as number) / 100,
    display: props.visible === false ? 'none' : 'flex',
    backgroundColor: props.backgroundColor ?? '#fff',
    borderColor: props.borderColor ?? '#e0e0e0',
    borderWidth: `${props.borderWidth ?? 1}px`,
    borderStyle: 'solid',
    borderRadius: `${props.borderRadius ?? 8}px`,
    boxShadow: props.boxShadow ?? '0 2px 4px rgba(0, 0, 0, 0.1)',
    padding: `${props.padding ?? 20}px`,
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
  }
})

// 标题样式
const titleStyleComputed = computed<CSSProperties>(() => {
  return {
    color: props.titleColor ?? '#909399',
    fontSize: `${props.titleFontSize ?? 14}px`,
    fontWeight: props.titleFontWeight ?? 'normal',
    margin: 0,
  }
})

// 数值样式
const valueStyleComputed = computed<CSSProperties>(() => {
  return {
    color: props.valueColor ?? '#303133',
    fontSize: `${props.valueFontSize ?? 24}px`,
    fontWeight: props.valueFontWeight ?? 'bold',
    lineHeight: 1,
  }
})

// 变化率样式
const changeStyleComputed = computed<CSSProperties>(() => {
  const changeVal = props.change ?? 0
  const color =
    changeVal > 0
      ? (props.changeColorPositive ?? '#28a745')
      : (props.changeColorNegative ?? '#dc3545')
  return {
    color,
    fontSize: `${props.changeFontSize ?? 14}px`,
    fontWeight: props.changeFontWeight ?? '500',
  }
})

// 图标样式
const iconStyle = computed<CSSProperties>(() => {
  return {
    fontSize: `${props.iconSize ?? 32}px`,
    color: props.iconColor ?? '#409eff',
  }
})
</script>

<style scoped>
.v-stat-card {
  box-sizing: border-box;
}

.v-stat-header {
  margin-bottom: 8px;
}

.v-stat-title {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

.v-stat-body {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.v-stat-icon {
  display: flex;
  align-items: center;
}

.v-stat-value {
  line-height: 1;
}

.v-stat-footer {
  margin-top: 8px;
}

.v-stat-change {
  font-weight: 500;
}
</style>
