<template>
  <el-button
    :type="type"
    :size="size"
    :plain="plain"
    :round="round"
    :circle="circle"
    :disabled="disabled"
    :icon="icon"
    :loading="loading"
    :style="buttonStyle"
    @click="handleClick"
  >
    {{ text }}
  </el-button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'
import { ElButton } from 'element-plus'

// 定义纯 UI Props
const props = withDefaults(
  defineProps<{
    // 内容
    text?: string

    // 类型
    type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text' | 'default'
    size?: 'large' | 'default' | 'small'

    // 状态
    plain?: boolean
    round?: boolean
    circle?: boolean
    disabled?: boolean
    loading?: boolean

    // 图标
    icon?: string

    // 样式
    width?: string | number
    height?: string | number
    backgroundColor?: string
    textColor?: string
    fontSize?: number
    fontWeight?: number | string
    borderRadius?: number
  }>(),
  {
    text: '按钮',
    type: 'primary',
    size: 'default',
    plain: false,
    round: false,
    circle: false,
    disabled: false,
    loading: false,
  },
)

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

// 按钮样式
const buttonStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {}

  if (props.width !== undefined) {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }

  if (props.height !== undefined) {
    style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }

  if (props.backgroundColor) {
    style.backgroundColor = props.backgroundColor
    style.borderColor = props.backgroundColor
  }

  if (props.textColor) {
    style.color = props.textColor
  }

  if (props.fontSize !== undefined) {
    style.fontSize = `${props.fontSize}px`
  }

  if (props.fontWeight !== undefined) {
    style.fontWeight = props.fontWeight
  }

  if (props.borderRadius !== undefined) {
    style.borderRadius = `${props.borderRadius}px`
  }

  return style
})

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
/* 样式由 Element Plus 和 props 控制 */
</style>
