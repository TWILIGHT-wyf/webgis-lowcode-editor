<template>
  <el-row
    :gutter="gutter"
    :justify="justify"
    :align="align"
    :tag="tag"
    :style="containerStyle"
    class="v-row"
  >
    <slot>
      <div class="v-row-placeholder" :style="placeholderStyle">
        {{ placeholder }}
      </div>
    </slot>
  </el-row>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'

// 定义纯 UI Props
const props = defineProps<{
  // Row 布局属性
  gutter?: number
  justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly'
  align?: 'top' | 'middle' | 'bottom'
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
const gutter = computed(() => props.gutter ?? 0)
const justify = computed(() => props.justify ?? 'start')
const align = computed(() => props.align ?? 'top')
const tag = computed(() => props.tag ?? 'div')
const placeholder = computed(() => props.placeholder ?? '行布局容器 - 可拖入其他组件')
</script>

<style scoped>
.v-row {
  width: 100%;
  box-sizing: border-box;
}

.v-row-placeholder {
  width: 100%;
}
</style>
