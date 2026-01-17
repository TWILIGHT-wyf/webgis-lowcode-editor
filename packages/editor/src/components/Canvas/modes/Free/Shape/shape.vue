<template>
  <div
    ref="wrapperRef"
    class="shape-wrapper"
    :data-component-id="id"
    :style="wrapperStyle"
    @click.stop="handleClick"
    @dblclick.stop="handleDoubleClick"
    @mouseenter="handleMouseEnter"
    @contextmenu.stop.prevent="emitOpenContextMenu"
  >
    <!-- 统一动画容器：内容 + 边框 一起动 -->
    <div class="shape-box" :class="contentClass" :style="contentStyle">
      <div class="shape-content">
        <slot />
      </div>
      <!-- 边框 -->
      <div v-if="isSelected && !isLocked" class="shape-border" :style="borderStyle" />

      <!-- 八个缩放节点（随动画一起） -->
      <template v-if="isSelected && !isLocked">
        <div
          v-for="handle in handles"
          :key="handle.id"
          class="shape-handle"
          :class="handle.class"
          @mousedown.stop="onHandleMouseDown($event, handle)"
        />

        <!-- 旋转手柄（随动画一起） -->
        <div class="shape-rotate" @mousedown.stop="onRotateMouseDown">
          <div class="rotate-icon">↻</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type CSSProperties, ref, inject, type Ref } from 'vue'
import { useComponent } from '@/stores/component'
import type { Component } from '@vela/core/types/components'
import { useSizeStore } from '@/stores/size'
import { storeToRefs } from 'pinia'
import { useCanvasInteraction } from '../composables/useCanvasInteraction'
import { useSnap } from '../composables/useSnap'
import { debounce, throttle } from 'lodash-es'
import {
  DRAG_THRESHOLD,
  SNAP_THRESHOLD,
  GRID_SIZE,
  MIN_COMPONENT_WIDTH,
  MIN_COMPONENT_HEIGHT,
} from '@vela/core/constants/editor'
import { useComponentEventHandlers } from '@/components/siderBar/events/events'

const props = defineProps<{ id: string }>()

const emit = defineEmits<{
  (e: 'open-context-menu', payload: { id: string; event: MouseEvent }): void
}>()

// ========== Store & Refs ==========
const compStore = useComponent()
const { isDragging } = storeToRefs(compStore)
const {
  selectedId: setSelected,
  updateComponentSize,
  updateComponentRotation,
  updateComponentPosition,
} = compStore

const sizeStore = useSizeStore()
const { scale } = storeToRefs(sizeStore)

const wrapperRef = ref<HTMLDivElement | null>(null)
const canvasWrapRef = inject<Ref<HTMLDivElement | null>>('canvasWrapRef')
const canvasPanX = inject<Ref<number>>('canvasPanX', ref(0))
const canvasPanY = inject<Ref<number>>('canvasPanY', ref(0))

// ========== Component Cache ==========
const componentCache = new WeakMap<object, Map<string, Component | undefined>>()

function getComponentById(store: Component[], id: string) {
  let cache = componentCache.get(store)
  if (!cache) {
    cache = new Map()
    componentCache.set(store, cache)
  }
  if (!cache.has(id)) {
    cache.set(
      id,
      store.find((c: Component) => c.id === id),
    )
  }
  return cache.get(id)
}

// ========== Component Data ==========
const currentComponent = computed(() => getComponentById(compStore.componentStore, props.id))
const position = computed(() => currentComponent.value?.position || { x: 0, y: 0 })
const size = computed(() => currentComponent.value?.size || { width: 100, height: 100 })
const rotation = computed(() => currentComponent.value?.rotation ?? 0)
const zIndex = computed(() => currentComponent.value?.zindex ?? 0)
const isLocked = computed(() => currentComponent.value?.style?.locked ?? false)
const isSelected = computed(() => compStore.isSelected(props.id))

// ========== Snap Logic ==========
const { snapToNeighbors, snapToGrid, boxCache, meComp } = useSnap()

const debouncedUpdatePosition = debounce(updateComponentPosition, 10)

let dragStartPos = { x: 0, y: 0 }
let childrenStartPos: Record<string, { x: number; y: number }> = {}

// ========== Drag Interaction ==========
useCanvasInteraction(wrapperRef, scale, {
  enableDrag: true,
  preventBubble: true,
  dragThreshold: DRAG_THRESHOLD,
  rootRefForAbs: canvasWrapRef,
  externalPanX: canvasPanX,
  externalPanY: canvasPanY,
  dragCallback: (x, y, ctrlPressed) => {
    ;(setSelected as (id: string) => void)(props.id)
    const comp = currentComponent.value
    if (!comp || isLocked.value) return

    let finalPosition = { x, y }
    if (ctrlPressed) {
      const gridSnap = snapToGrid({ x, y }, GRID_SIZE)
      finalPosition = gridSnap.position
    } else {
      const snap = snapToNeighbors(SNAP_THRESHOLD, { x, y })
      if (snap) {
        finalPosition = snap.position
      }
    }

    debouncedUpdatePosition(finalPosition)

    if (comp.type === 'Group' && comp.children) {
      const actualDx = finalPosition.x - dragStartPos.x
      const actualDy = finalPosition.y - dragStartPos.y
      comp.children.forEach((childId: string) => {
        const child = getComponentById(compStore.componentStore, childId)
        const startPos = childrenStartPos[childId]
        if (child && startPos) {
          child.position.x = startPos.x + actualDx
          child.position.y = startPos.y + actualDy
        }
      })
    }
  },
  onDragStart: () => {
    isDragging.value = true
    const comp = currentComponent.value
    if (comp) {
      dragStartPos = { ...comp.position }
      if (comp.type === 'Group' && comp.children) {
        childrenStartPos = {}
        comp.children.forEach((childId: string) => {
          const child = getComponentById(compStore.componentStore, childId)
          if (child) {
            childrenStartPos[childId] = { ...child.position }
          }
        })
      }
    }
  },
  onDragEnd: (altPressed) => {
    isDragging.value = false
    childrenStartPos = {}

    if (!altPressed) return

    const comp = currentComponent.value
    if (!comp) return

    const containerTypes = ['panel', 'row', 'col', 'flex', 'grid', 'modal', 'tabs', 'group']
    const containers = compStore.componentStore.filter((c) => {
      if (!c.type) return false
      const t = String(c.type).toLowerCase()
      return containerTypes.includes(t) && c.id !== comp.id && c.id !== comp.groupId
    })

    const compCenterX = comp.position.x + comp.size.width / 2
    const compCenterY = comp.position.y + comp.size.height / 2

    const hitContainers = containers
      .filter((c) => {
        return (
          compCenterX >= c.position.x &&
          compCenterX <= c.position.x + c.size.width &&
          compCenterY >= c.position.y &&
          compCenterY <= c.position.y + c.size.height
        )
      })
      .sort((a, b) => b.zindex - a.zindex)

    if (hitContainers.length > 0) {
      const targetContainer = hitContainers[0]
      if (!targetContainer || comp.groupId === targetContainer.id) return

      if (comp.groupId) {
        const oldParent = compStore.componentStore.find((c) => c.id === comp.groupId)
        if (oldParent && oldParent.children) {
          oldParent.children = oldParent.children.filter((cid) => cid !== comp.id)
        }
      }

      const relativeX = comp.position.x - targetContainer.position.x
      const relativeY = comp.position.y - targetContainer.position.y
      comp.position.x = relativeX
      comp.position.y = relativeY

      if (!targetContainer.children) {
        targetContainer.children = []
      }
      if (!targetContainer.children.includes(comp.id)) {
        targetContainer.children.push(comp.id)
      }
      comp.groupId = targetContainer.id

      if (!targetContainer.layout) {
        targetContainer.layout = {
          mode: 'absolute',
          gap: 8,
          columns: 2,
          align: 'start',
          padding: 0,
        }
      }

      compStore.commitDebounced()
    }
  },
})

// ========== Styles ==========
const wrapperStyle = computed<CSSProperties>(
  () =>
    ({
      position: 'absolute',
      left: position.value.x + 'px',
      top: position.value.y + 'px',
      width: size.value.width + 'px',
      height: size.value.height + 'px',
      transform: `rotate(${rotation.value}deg)`,
      transformOrigin: 'center center',
      zIndex: zIndex.value,
    }) as CSSProperties,
)

const isMultiSelected = computed(() => {
  const selectedCount = compStore.selectedIds.length
  return selectedCount > 1 && compStore.isSelected(props.id)
})

const borderStyle = computed<CSSProperties>(
  () =>
    ({
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      border: isMultiSelected.value ? '1px dashed #409EFF' : '1px solid #409EFF',
      pointerEvents: 'none',
    }) as CSSProperties,
)

// ========== Resize Handles ==========
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

interface HandleMeta {
  id: string
  class: string
}

let startMouseX = 0
let startMouseY = 0
let startSize = { width: 0, height: 0 }
let startPos = { x: 0, y: 0 }
let currentHandle = ''
let childrenStartState: Record<
  string,
  { position: { x: number; y: number }; size: { width: number; height: number } }
> = {}
let isCtrlPressed = false

const onHandleMouseDown = (e: MouseEvent, handle: HandleMeta) => {
  e.preventDefault()
  if (isLocked.value) return
  ;(setSelected as (id: string) => void)(props.id)

  startMouseX = e.clientX
  startMouseY = e.clientY
  startSize = { ...size.value }
  startPos = { ...position.value }
  currentHandle = handle.id
  isCtrlPressed = e.ctrlKey

  const comp = currentComponent.value
  if (comp && comp.type === 'Group' && comp.children) {
    childrenStartState = {}
    comp.children.forEach((childId: string) => {
      const child = compStore.componentStore.find((c) => c.id === childId)
      if (child) {
        childrenStartState[childId] = {
          position: { ...child.position },
          size: { ...child.size },
        }
      }
    })
  }

  window.addEventListener('mousemove', throttledHandleMouseMove)
  window.addEventListener('mouseup', onHandleMouseUp)
}

const onHandleMouseMove = (e: MouseEvent) => {
  isDragging.value = true
  const dx = (e.clientX - startMouseX) / (scale.value || 1)
  const dy = (e.clientY - startMouseY) / (scale.value || 1)

  let newWidth = startSize.width
  let newHeight = startSize.height
  let newX = startPos.x
  let newY = startPos.y

  if (currentHandle.includes('e')) newWidth = startSize.width + dx
  if (currentHandle.includes('w')) {
    newWidth = startSize.width - dx
    newX = startPos.x + dx
  }
  if (currentHandle.includes('s')) newHeight = startSize.height + dy
  if (currentHandle.includes('n')) {
    newHeight = startSize.height - dy
    newY = startPos.y + dy
  }

  if (newWidth < MIN_COMPONENT_WIDTH) {
    if (currentHandle.includes('w')) {
      newX = startPos.x + (startSize.width - MIN_COMPONENT_WIDTH)
    }
    newWidth = MIN_COMPONENT_WIDTH
  }
  if (newHeight < MIN_COMPONENT_HEIGHT) {
    if (currentHandle.includes('n')) {
      newY = startPos.y + (startSize.height - MIN_COMPONENT_HEIGHT)
    }
    newHeight = MIN_COMPONENT_HEIGHT
  }

  const SNAP_TOL = SNAP_THRESHOLD
  const gridSize = GRID_SIZE
  const myId = meComp.value.id
  const guideXs: number[] = []
  const guideYs: number[] = []

  if (isCtrlPressed) {
    const gridX = Math.round(newX / gridSize) * gridSize
    const gridY = Math.round(newY / gridSize) * gridSize
    const gridRight = Math.round((newX + newWidth) / gridSize) * gridSize
    const gridBottom = Math.round((newY + newHeight) / gridSize) * gridSize

    if (currentHandle.includes('w') && Math.abs(newX - gridX) < SNAP_TOL) {
      const rightFixed = startPos.x + startSize.width
      newX = gridX
      newWidth = Math.max(MIN_COMPONENT_WIDTH, rightFixed - newX)
    }
    if (currentHandle.includes('e') && Math.abs(newX + newWidth - gridRight) < SNAP_TOL) {
      newWidth = Math.max(MIN_COMPONENT_WIDTH, gridRight - newX)
    }
    if (currentHandle.includes('n') && Math.abs(newY - gridY) < SNAP_TOL) {
      const bottomFixed = startPos.y + startSize.height
      newY = gridY
      newHeight = Math.max(MIN_COMPONENT_HEIGHT, bottomFixed - newY)
    }
    if (currentHandle.includes('s') && Math.abs(newY + newHeight - gridBottom) < SNAP_TOL) {
      newHeight = Math.max(MIN_COMPONENT_HEIGHT, gridBottom - newY)
    }
  } else {
    boxCache.value.forEach((b, id) => {
      if (!id || id === myId) return
      guideXs.push(b.minx, b.cx, b.maxx, ...b.corners.map((p) => p.x))
      guideYs.push(b.miny, b.cy, b.maxy, ...b.corners.map((p) => p.y))
    })

    if (currentHandle.includes('e') || currentHandle.includes('w')) {
      if (currentHandle.includes('e')) {
        const target = newX + newWidth
        let best = { dist: SNAP_TOL + 1, gx: target }
        for (const gx of guideXs) {
          const d = Math.abs(gx - target)
          if (d < best.dist) best = { dist: d, gx }
        }
        if (best.dist <= SNAP_TOL) {
          newWidth = Math.max(MIN_COMPONENT_WIDTH, best.gx - newX)
        }
      }
      if (currentHandle.includes('w')) {
        const rightFixed = startPos.x + startSize.width
        const target = newX
        let best = { dist: SNAP_TOL + 1, gx: target }
        for (const gx of guideXs) {
          const d = Math.abs(gx - target)
          if (d < best.dist) best = { dist: d, gx }
        }
        if (best.dist <= SNAP_TOL) {
          newX = best.gx
          newWidth = Math.max(MIN_COMPONENT_WIDTH, rightFixed - newX)
          if (newWidth === MIN_COMPONENT_WIDTH) {
            newX = rightFixed - MIN_COMPONENT_WIDTH
          }
        }
      }
    }

    if (currentHandle.includes('s') || currentHandle.includes('n')) {
      if (currentHandle.includes('s')) {
        const target = newY + newHeight
        let best = { dist: SNAP_TOL + 1, gy: target }
        for (const gy of guideYs) {
          const d = Math.abs(gy - target)
          if (d < best.dist) best = { dist: d, gy }
        }
        if (best.dist <= SNAP_TOL) {
          newHeight = Math.max(MIN_COMPONENT_HEIGHT, best.gy - newY)
        }
      }
      if (currentHandle.includes('n')) {
        const bottomFixed = startPos.y + startSize.height
        const target = newY
        let best = { dist: SNAP_TOL + 1, gy: target }
        for (const gy of guideYs) {
          const d = Math.abs(gy - target)
          if (d < best.dist) best = { dist: d, gy }
        }
        if (best.dist <= SNAP_TOL) {
          newY = best.gy
          newHeight = Math.max(MIN_COMPONENT_HEIGHT, bottomFixed - newY)
          if (newHeight === MIN_COMPONENT_HEIGHT) {
            newY = bottomFixed - MIN_COMPONENT_HEIGHT
          }
        }
      }
    }
  }

  updateComponentSize({ width: newWidth, height: newHeight })
  updateComponentPosition({ x: newX, y: newY })

  const comp = currentComponent.value
  if (comp && comp.type === 'Group' && comp.children) {
    const scaleX = newWidth / startSize.width
    const scaleY = newHeight / startSize.height

    comp.children.forEach((childId: string) => {
      const child = getComponentById(compStore.componentStore, childId)
      const childStart = childrenStartState[childId]
      if (child && childStart) {
        const relX = childStart.position.x - startPos.x
        const relY = childStart.position.y - startPos.y
        child.position.x = newX + relX * scaleX
        child.position.y = newY + relY * scaleY
        child.size.width = childStart.size.width * scaleX
        child.size.height = childStart.size.height * scaleY
      }
    })
  }
}

const throttledHandleMouseMove = throttle(onHandleMouseMove, 16)

const onHandleMouseUp = () => {
  isDragging.value = false
  window.removeEventListener('mousemove', throttledHandleMouseMove)
  window.removeEventListener('mouseup', onHandleMouseUp)
  currentHandle = ''
  childrenStartState = {}
}

// ========== Rotation ==========
let startAngle = 0
let centerX = 0
let centerY = 0

const onRotateMouseDown = (e: MouseEvent) => {
  e.preventDefault()
  if (isLocked.value) return
  ;(setSelected as (id: string) => void)(props.id)

  const wrapperEl = (e.currentTarget as HTMLElement).parentElement as HTMLElement
  const rect = wrapperEl.getBoundingClientRect()
  centerX = rect.left + rect.width / 2
  centerY = rect.top + rect.height / 2
  const currentRotationDeg = rotation.value || 0
  startAngle =
    Math.atan2(e.clientY - centerY, e.clientX - centerX) - (currentRotationDeg * Math.PI) / 180
  window.addEventListener('mousemove', throttledRotateMouseMove)
  window.addEventListener('mouseup', onRotateMouseUp)
}

const onRotateMouseMove = (e: MouseEvent) => {
  isDragging.value = true
  const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) - startAngle
  const deg = (angle * 180) / Math.PI
  updateComponentRotation(deg)
}

const throttledRotateMouseMove = throttle(onRotateMouseMove, 16)

const onRotateMouseUp = () => {
  isDragging.value = false
  window.removeEventListener('mousemove', throttledRotateMouseMove)
  window.removeEventListener('mouseup', onRotateMouseUp)
}

// ========== Animation ==========
const contentClass = computed(() => currentComponent.value?.animation?.class || '')
const contentStyle = computed<CSSProperties>(() => {
  const anim = currentComponent.value?.animation
  if (!anim) return {}
  const iteration = anim.iterationCount
  return {
    animationDuration: anim.duration ? `${anim.duration}s` : undefined,
    animationTimingFunction: anim.timingFunction || undefined,
    animationIterationCount: (iteration === undefined
      ? undefined
      : iteration === 'infinite'
        ? 'infinite'
        : String(iteration)) as CSSProperties['animationIterationCount'],
    animationFillMode: 'both',
  }
})

// ========== Event Handlers ==========
const eventHandlers = useComponentEventHandlers(props.id)

function emitOpenContextMenu(e: MouseEvent) {
  emit('open-context-menu', { id: props.id, event: e })
}

async function handleClick(e: MouseEvent) {
  const comp = compStore.componentStore.find((c) => c.id === props.id)
  if (comp?.style?.locked && !e.altKey) {
    return
  }
  compStore.toggleSelect(props.id, e.ctrlKey)
  await eventHandlers.handleClick()
}

async function handleDoubleClick() {
  await eventHandlers.handleDoubleClick()
}

async function handleMouseEnter() {
  await eventHandlers.handleMouseEnter()
}
</script>

<style>
/* 性能优化：shape-wrapper 启用独立合成层 */
.shape-wrapper {
  contain: layout style;
  will-change: transform;
}

.shape-box {
  position: relative;
  width: 100%;
  height: 100%;
}
.shape-content {
  width: 100%;
  height: 100%;
  /* 性能优化：限制内容重绘范围 */
  contain: content;
}
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
