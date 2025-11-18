<template>
  <div ref="wrapperRef" class="shape-wrapper" :style="wrapperStyle">
    <div class="shape-content">
      <slot />
    </div>

    <!-- 边框 -->
    <div v-if="isSelected" class="shape-border" :style="borderStyle" />

    <!-- 八个缩放节点 -->
    <template v-if="isSelected">
      <div
        v-for="handle in handles"
        :key="handle.id"
        class="shape-handle"
        :class="handle.class"
        @mousedown.stop="onHandleMouseDown($event, handle)"
      />

      <!-- 旋转手柄 -->
      <div class="shape-rotate" @mousedown.stop="onRotateMouseDown">
        <div class="rotate-icon">↻</div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, type CSSProperties, ref, inject, type Ref } from 'vue'
import { useComponent } from '@/stores/component'
import { useSizeStore } from '@/stores/size'
import { storeToRefs } from 'pinia'
import { useCanvasInteraction } from '@/composable/useCanvasInteraction'
import { throttle, debounce } from '@/utils/throttleDebounce'

const props = defineProps<{
  id: string
}>()

const compStore = useComponent()
const { selectComponent } = storeToRefs(compStore)
const {
  selectedId: setSelected,
  updateComponentSize,
  updateComponentRotation,
  updateComponentPosition,
} = compStore

// 从 store 找到当前组件实例
const currentComponent = computed(() =>
  compStore.componentStore.find((comp) => comp.id === props.id),
)

// 从 store 读取数据
const position = computed(() => currentComponent.value?.position || { x: 0, y: 0 })
const size = computed(() => currentComponent.value?.size || { width: 100, height: 100 })
const rotation = computed(() => currentComponent.value?.rotation || '0deg')

// 全局缩放
const sizeStore = useSizeStore()
const { scale } = storeToRefs(sizeStore)

const wrapperRef = ref<HTMLDivElement | null>(null)
// 注入根画布容器，用于绝对坐标计算
const canvasWrapRef = inject<Ref<HTMLDivElement | null>>('canvasWrapRef')

// 防抖更新位置
const debouncedUpdatePosition = debounce(updateComponentPosition as any, 10) // eslint-disable-line @typescript-eslint/no-explicit-any

const {} = useCanvasInteraction(wrapperRef, scale, {
  enableDrag: true,
  preventBubble: true,
  dragThreshold: 5,
  rootRefForAbs: canvasWrapRef as any, // eslint-disable-line @typescript-eslint/no-explicit-any
  dragCallback: (x, y) => {
    setSelected(props.id)
    debouncedUpdatePosition({ x, y })
  },
})

const isSelected = computed(() => selectComponent.value?.id === props.id)

// 包装器样式
const wrapperStyle = computed<CSSProperties>(
  () =>
    ({
      position: 'absolute',
      left: position.value.x + 'px',
      top: position.value.y + 'px',
      width: size.value.width + 'px',
      height: size.value.height + 'px',
      transform: `rotate(${rotation.value})`,
      transformOrigin: 'center center',
    }) as CSSProperties,
)

// 边框样式
const borderStyle = computed<CSSProperties>(
  () =>
    ({
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      border: '1px solid #409EFF',
      pointerEvents: 'none',
    }) as CSSProperties,
)

// 八个缩放节点
const handles = computed(() => [
  { id: 'nw', class: 'nw' },
  { id: 'ne', class: 'ne' },
  { id: 'sw', class: 'sw' },
  { id: 'se', class: 'se' },
  { id: 'n', class: 'n' },
  { id: 's', class: 's' },
  { id: 'w', class: 'w' },
  { id: 'e', class: 'e' },
])

// 缩放调整
interface HandleMeta {
  id: string
  class: string
}
let startMouseX = 0,
  startMouseY = 0
let startSize = { width: 0, height: 0 }
let currentHandle = ''
const onHandleMouseDown = (e: MouseEvent, handle: HandleMeta) => {
  e.preventDefault()
  ;(setSelected as (id: string) => void)(props.id)
  startMouseX = e.clientX
  startMouseY = e.clientY
  startSize = { ...size.value }
  currentHandle = handle.id
  window.addEventListener('mousemove', throttledHandleMouseMove)
  window.addEventListener('mouseup', onHandleMouseUp)
}
const onHandleMouseMove = (e: MouseEvent) => {
  const dx = (e.clientX - startMouseX) / (scale.value || 1)
  const dy = (e.clientY - startMouseY) / (scale.value || 1)
  const newSize = { ...startSize }

  if (currentHandle.includes('e')) newSize.width = startSize.width + dx
  if (currentHandle.includes('w')) newSize.width = startSize.width - dx
  if (currentHandle.includes('s')) newSize.height = startSize.height + dy
  if (currentHandle.includes('n')) newSize.height = startSize.height - dy

  newSize.width = Math.max(10, newSize.width)
  newSize.height = Math.max(10, newSize.height)

  updateComponentSize(newSize)
}
const throttledHandleMouseMove = throttle(onHandleMouseMove as any, 16) // eslint-disable-line @typescript-eslint/no-explicit-any
const onHandleMouseUp = () => {
  window.removeEventListener('mousemove', throttledHandleMouseMove)
  window.removeEventListener('mouseup', onHandleMouseUp)
  currentHandle = ''
}

// 旋转调整
let startAngle = 0
let centerX = 0,
  centerY = 0
const onRotateMouseDown = (e: MouseEvent) => {
  e.preventDefault()
  ;(setSelected as (id: string) => void)(props.id)
  const wrapperEl = (e.currentTarget as HTMLElement).parentElement as HTMLElement
  const rect = wrapperEl.getBoundingClientRect()
  centerX = rect.left + rect.width / 2
  centerY = rect.top + rect.height / 2
  const currentRotationDeg =
    typeof rotation.value === 'number' ? rotation.value : parseFloat(rotation.value || '0')
  startAngle =
    Math.atan2(e.clientY - centerY, e.clientX - centerX) - (currentRotationDeg * Math.PI) / 180
  window.addEventListener('mousemove', throttledRotateMouseMove)
  window.addEventListener('mouseup', onRotateMouseUp)
}
const onRotateMouseMove = (e: MouseEvent) => {
  const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) - startAngle
  const deg = (angle * 180) / Math.PI
  updateComponentRotation(`${deg}deg`)
}
const throttledRotateMouseMove = throttle(onRotateMouseMove as any, 16) // eslint-disable-line @typescript-eslint/no-explicit-any
const onRotateMouseUp = () => {
  window.removeEventListener('mousemove', throttledRotateMouseMove)
  window.removeEventListener('mouseup', onRotateMouseUp)
}
</script>

<style>
.shape-handle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #409eff;
  border: 1px solid #fff;
  pointer-events: auto;
  cursor: pointer;
}

.nw {
  top: -4px;
  left: -4px;
  cursor: nw-resize;
}
.ne {
  top: -4px;
  right: -4px;
  cursor: ne-resize;
}
.sw {
  bottom: -4px;
  left: -4px;
  cursor: sw-resize;
}
.se {
  bottom: -4px;
  right: -4px;
  cursor: se-resize;
}
.n {
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
  cursor: n-resize;
}
.s {
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  cursor: s-resize;
}
.w {
  left: -4px;
  top: 50%;
  transform: translateY(-50%);
  cursor: w-resize;
}
.e {
  right: -4px;
  top: 50%;
  transform: translateY(-50%);
  cursor: e-resize;
}

.shape-rotate {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 20px;
  background: #409eff;
  border-radius: 50%;
  cursor: alias;
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rotate-icon {
  color: #fff;
  font-size: 12px;
}
</style>
