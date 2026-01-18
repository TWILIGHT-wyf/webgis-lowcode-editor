<template>
  <Teleport to="body">
    <Transition name="indicator-fade">
      <div v-if="visible" class="drop-indicator" :style="indicatorStyle">
        <!-- Before/After: 水平蓝线 -->
        <template v-if="position === 'before' || position === 'after'">
          <div class="indicator-line" :class="[`position-${position}`]">
            <div class="indicator-dot left" />
            <div class="indicator-dot right" />
          </div>
        </template>

        <!-- Inside: 蓝色虚线边框 -->
        <template v-if="position === 'inside'">
          <div class="indicator-box" />
        </template>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import type { DropIndicatorRect, DropPosition } from './types'

interface Props {
  /** 是否显示指示器 */
  visible: boolean
  /** 目标元素的位置信息 */
  rect: DropIndicatorRect | null
  /** 插入位置 */
  position: DropPosition
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  rect: null,
  position: 'after',
})

// 指示器容器样式
const indicatorStyle = computed<CSSProperties>(() => {
  if (!props.rect) return { display: 'none' }

  return {
    position: 'fixed',
    top: `${props.rect.top}px`,
    left: `${props.rect.left}px`,
    width: `${props.rect.width}px`,
    height: `${props.rect.height}px`,
    pointerEvents: 'none',
    zIndex: 10000,
  }
})
</script>

<style scoped>
.drop-indicator {
  pointer-events: none;
}

/* ========== Transition ========== */
.indicator-fade-enter-active {
  transition: opacity 0.15s ease-out;
}

.indicator-fade-leave-active {
  transition: opacity 0.1s ease-in;
}

.indicator-fade-enter-from,
.indicator-fade-leave-to {
  opacity: 0;
}

/* ========== Line Indicator (before/after) ========== */
.indicator-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #409eff, #66b1ff, #409eff);
  background-size: 200% 100%;
  border-radius: 1px;
  box-shadow: 0 0 6px rgba(64, 158, 255, 0.6);
  animation: line-shimmer 1.5s ease-in-out infinite;
}

.indicator-line.position-before {
  top: -1px;
}

.indicator-line.position-after {
  bottom: -1px;
}

@keyframes line-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* ========== Dots ========== */
.indicator-dot {
  position: absolute;
  top: 50%;
  width: 6px;
  height: 6px;
  background: #409eff;
  border-radius: 50%;
  transform: translateY(-50%);
  box-shadow:
    0 0 0 2px #fff,
    0 0 6px rgba(64, 158, 255, 0.8);
}

.indicator-dot.left {
  left: -3px;
}

.indicator-dot.right {
  right: -3px;
}

/* ========== Box Indicator (inside) ========== */
.indicator-box {
  position: absolute;
  inset: 0;
  border: 2px dashed #409eff;
  border-radius: 4px;
  background: rgba(64, 158, 255, 0.06);
  animation: box-pulse 1.2s ease-in-out infinite;
}

@keyframes box-pulse {
  0%,
  100% {
    border-color: #409eff;
    background: rgba(64, 158, 255, 0.06);
    box-shadow: inset 0 0 0 0 rgba(64, 158, 255, 0);
  }
  50% {
    border-color: #66b1ff;
    background: rgba(64, 158, 255, 0.1);
    box-shadow: inset 0 0 20px 0 rgba(64, 158, 255, 0.1);
  }
}
</style>
