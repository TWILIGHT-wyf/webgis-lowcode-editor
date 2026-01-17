<template>
  <div class="group-container" :style="containerStyle">
    <slot>
      <div v-if="showPlaceholder" class="group-placeholder">
        {{ placeholder }}
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'

export interface GroupProps {
  /** 容器透明度 0-1 */
  opacity?: number
  /** 是否可见 */
  visible?: boolean
  /** 旋转角度 */
  rotation?: number
  /** 边框圆角 */
  borderRadius?: number
  /** 背景色 */
  backgroundColor?: string
  /** 边框样式 */
  border?: string
  /** 是否显示占位符 */
  showPlaceholder?: boolean
  /** 占位符文本 */
  placeholder?: string
}

const props = withDefaults(defineProps<GroupProps>(), {
  opacity: 1,
  visible: true,
  rotation: 0,
  borderRadius: 0,
  backgroundColor: 'transparent',
  border: 'none',
  showPlaceholder: true,
  placeholder: '组合',
})

const containerStyle = computed<CSSProperties>(() => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  boxSizing: 'border-box',
  opacity: props.opacity,
  display: props.visible ? 'block' : 'none',
  transform: props.rotation ? `rotate(${props.rotation}deg)` : undefined,
  borderRadius: props.borderRadius ? `${props.borderRadius}px` : undefined,
  backgroundColor: props.backgroundColor,
  border: props.border,
}))
</script>

<style scoped>
.group-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.group-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #909399;
  font-size: 12px;
  opacity: 0.5;
  pointer-events: none;
}
</style>
