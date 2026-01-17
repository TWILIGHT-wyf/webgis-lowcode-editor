<template>
  <div class="snap-line-container">
    <svg class="snap-line-svg">
      <line
        v-for="(line, index) in lines"
        :key="index"
        :x1="line.x !== undefined ? line.x : 0"
        :y1="line.x !== undefined ? 0 : line.y"
        :x2="line.x !== undefined ? line.x : '100%'"
        :y2="line.x !== undefined ? '100%' : line.y"
        class="snap-line"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
/**
 * SnapLine - 纯 UI 组件
 * 只负责渲染吸附辅助线，不包含计算逻辑
 */
interface SnapLine {
  x?: number
  y?: number
}

defineProps<{
  lines: SnapLine[]
}>()
</script>

<style scoped>
.snap-line-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 999;
}

.snap-line-svg {
  width: 100%;
  height: 100%;
}

.snap-line {
  stroke: #ff4444;
  stroke-width: 1px;
  stroke-dasharray: 4, 2;
  vector-effect: non-scaling-stroke;
}
</style>
