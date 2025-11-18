<template>
  <div class="snap-container">
    <canvas ref="canvasRef" class="snap-canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, nextTick } from 'vue'
import { useSnap } from './snap.ts'
import { useComponent } from '@/stores/component'
import { storeToRefs } from 'pinia'

const canvasRef = ref<HTMLCanvasElement>()
const lines = ref<{ x?: number; y?: number }[]>([])
const store = useComponent()
const { selectComponent, isDragging } = storeToRefs(store)
const { snapToNeighbors } = useSnap()

// 监听选中组件变化（位置/尺寸/旋转），更新辅助线
watch(
  () => {
    const c = selectComponent.value
    // 只有在拖拽中才需要刷新吸附线依赖（加上 isDragging 触发）
    return isDragging.value && c
      ? [c.position.x, c.position.y, c.size.width, c.size.height, c.rotation, isDragging.value]
      : null
  },
  () => updateSnapLines(),
  { immediate: true },
)

function updateSnapLines() {
  if (!selectComponent.value || !isDragging.value) {
    clearLines()
    return
  }
  const snap = snapToNeighbors(10)
  if (snap) {
    lines.value = snap.lines
    drawLines()
  } else {
    clearLines()
  }
}

function clearLines() {
  lines.value = []
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function drawLines() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.strokeStyle = 'red'
  ctx.lineWidth = 1

  lines.value.forEach((line) => {
    if (line.x !== undefined) {
      ctx.beginPath()
      ctx.moveTo(line.x, 0)
      ctx.lineTo(line.x, canvas.height)
      ctx.stroke()
    }
    if (line.y !== undefined) {
      ctx.beginPath()
      ctx.moveTo(0, line.y)
      ctx.lineTo(canvas.width, line.y)
      ctx.stroke()
    }
  })
}

// 把画布大小同步为容器大小
function resizeCanvas() {
  const el = canvasRef.value
  if (!el) return
  const parent = el.parentElement
  if (!parent) return
  const { clientWidth, clientHeight } = parent
  el.width = clientWidth
  el.height = clientHeight
  drawLines()
}

onMounted(async () => {
  await nextTick()
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCanvas)
})
</script>

<style scoped>
.snap-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.snap-canvas {
  width: 100%;
  height: 100%;
}
</style>
