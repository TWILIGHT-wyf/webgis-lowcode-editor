<template>
  <el-col
    :span="span"
    :offset="offset"
    :push="push"
    :pull="pull"
    :xs="xs"
    :sm="sm"
    :md="md"
    :lg="lg"
    :xl="xl"
    :tag="tag"
    :style="containerStyle"
    class="v-col"
  >
    <slot>
      <div class="v-col-placeholder" :style="placeholderStyle">
        {{ placeholder }}
      </div>
    </slot>
  </el-col>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'

// 响应式尺寸类型
type ResponsiveSize = number | { span?: number; offset?: number; push?: number; pull?: number }

// 定义纯 UI Props
const props = defineProps<{
  // Col 布局属性
  span?: number
  offset?: number
  push?: number
  pull?: number
  xs?: ResponsiveSize
  sm?: ResponsiveSize
  md?: ResponsiveSize
  lg?: ResponsiveSize
  xl?: ResponsiveSize
  tag?: string

  // 容器样式
  padding?: number
  backgroundColor?: string
  borderRadius?: number
  borderWidth?: number
  borderColor?: string
  minHeight?: string

  // 占位文本
  placeholder?: string
  textColor?: string
  fontSize?: number
}>()

// 容器样式
const containerStyle = computed<CSSProperties>(() => {
  return {
    padding: `${props.padding ?? 0}px`,
    backgroundColor: props.backgroundColor ?? 'transparent',
    borderRadius: `${props.borderRadius ?? 0}px`,
    borderWidth: `${props.borderWidth ?? 0}px`,
    borderStyle: props.borderWidth ? 'solid' : 'none',
    borderColor: props.borderColor ?? '#dcdfe6',
    minHeight: props.minHeight ?? 'auto',
    boxSizing: 'border-box',
  }
})

// 占位样式
const placeholderStyle = computed<CSSProperties>(() => {
  return {
    width: '100%',
    minHeight: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: props.textColor ?? '#909399',
    fontSize: `${props.fontSize ?? 14}px`,
  }
})

// Props 默认值
const span = computed(() => props.span ?? 24)
const offset = computed(() => props.offset ?? 0)
const push = computed(() => props.push ?? 0)
const pull = computed(() => props.pull ?? 0)
const xs = computed(() => props.xs)
const sm = computed(() => props.sm)
const md = computed(() => props.md)
const lg = computed(() => props.lg)
const xl = computed(() => props.xl)
const tag = computed(() => props.tag ?? 'div')
const placeholder = computed(() => props.placeholder ?? '列布局容器 - 可拖入其他组件')
</script>

<style scoped>
.v-col {
  box-sizing: border-box;
}

.v-col-placeholder {
  width: 100%;
}
</style>
