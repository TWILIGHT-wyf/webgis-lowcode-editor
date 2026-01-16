import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue'
import { throttle } from 'lodash-es'
import type { ComponentPayload } from '@lowcode/core/types/components'
import { MIN_SCALE, MAX_SCALE, ZOOM_FACTOR } from '@lowcode/core/constants/editor'

export function useCanvasInteraction(
  wrapRef: Ref<HTMLDivElement | null>,
  scaleRef: Ref<number>,
  options: {
    enableZoom?: boolean
    enablePan?: boolean
    enableDrag?: boolean
    // 开启在容器上监听 drop，并通过回调抛出落点
    enableDrop?: boolean
    onDrop?: (data: ComponentPayload, position: { x: number; y: number }) => void
    dragCallback?: (x: number, y: number, ctrlPressed: boolean, altPressed: boolean) => void
    preventBubble?: boolean
    dragThreshold?: number
    rootRefForAbs?: Ref<HTMLDivElement | null>
    onDragStart?: () => void
    onDragEnd?: (altPressed: boolean) => void
    // 允许外部传入平移偏移，用于子组件拖拽时使用画布的真实平移值
    externalPanX?: Ref<number>
    externalPanY?: Ref<number>
  } = {},
) {
  // 如果外部传入 pan 值则使用外部的，否则创建本地的（用于画布平移）
  const panX = options.externalPanX ?? ref(0)
  const panY = options.externalPanY ?? ref(0)
  const isPanning = ref(false)
  const isDragging = ref(false)

  const clamp = (n: number, min: number, max: number) => Math.min(Math.max(min, n), max)

  // 滚轮缩放
  const handleWheel = (e: WheelEvent) => {
    if (options.enableZoom === false) return
    e.preventDefault()
    const factor = Math.pow(ZOOM_FACTOR, e.deltaY)
    scaleRef.value = clamp(scaleRef.value * factor, MIN_SCALE, MAX_SCALE)
  }

  // 拖拽平移
  let startMouseX = 0,
    startMouseY = 0
  let startPanX = 0,
    startPanY = 0
  let rafId: number | null = null
  let pendingPanX = 0
  let pendingPanY = 0

  const onPanStart = (e: MouseEvent) => {
    if (e.button !== 0 || !options.enablePan) return
    isPanning.value = true
    startMouseX = e.clientX
    startMouseY = e.clientY
    startPanX = panX.value
    startPanY = panY.value
    window.addEventListener('mousemove', onPanMove)
    window.addEventListener('mouseup', onPanEnd)
    e.preventDefault()
  }

  const onPanMove = (e: MouseEvent) => {
    if (!isPanning.value) return
    // 缓存待应用的偏移量
    pendingPanX = startPanX + (e.clientX - startMouseX)
    pendingPanY = startPanY + (e.clientY - startMouseY)

    // 使用 requestAnimationFrame 批量更新
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        panX.value = pendingPanX
        panY.value = pendingPanY
        rafId = null
      })
    }
  }

  const onPanEnd = () => {
    isPanning.value = false
    // 确保最后一次更新被应用
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      panX.value = pendingPanX
      panY.value = pendingPanY
      rafId = null
    }
    window.removeEventListener('mousemove', onPanMove)
    window.removeEventListener('mouseup', onPanEnd)
  }

  // 组件拖拽
  let startDragMouseX = 0
  let startDragMouseY = 0
  let anchorX = 0
  let anchorY = 0
  let dragAltPressed = false
  const onDragStart = (e: MouseEvent) => {
    if (e.button !== 0 || !options.enableDrag) return
    isDragging.value = false
    startDragMouseX = e.clientX
    startDragMouseY = e.clientY
    dragAltPressed = e.altKey

    // 计算锚点：鼠标(stage) 与 元素左上角(stage) 的偏移
    const rootEl = options.rootRefForAbs?.value ?? wrapRef.value
    const targetEl = wrapRef.value
    if (rootEl && targetEl) {
      const rootRect = rootEl.getBoundingClientRect()
      // 鼠标转换到 stage 坐标
      const mouseStageX = (e.clientX - rootRect.left - panX.value) / (scaleRef.value || 1)
      const mouseStageY = (e.clientY - rootRect.top - panY.value) / (scaleRef.value || 1)
      // 读取元素当前 left/top
      const style = window.getComputedStyle(targetEl)
      const elLeft = parseFloat(style.left || '0') || 0
      const elTop = parseFloat(style.top || '0') || 0
      anchorX = mouseStageX - elLeft
      anchorY = mouseStageY - elTop
    } else {
      anchorX = 0
      anchorY = 0
    }
    window.addEventListener('mousemove', onDragMove)
    window.addEventListener('mouseup', onDragEnd)
    e.preventDefault()
  }
  const rawOnDragMove = (e: MouseEvent) => {
    if (!isDragging.value) {
      const threshold = options.dragThreshold || 0
      if (
        Math.abs(e.clientX - startDragMouseX) > threshold ||
        Math.abs(e.clientY - startDragMouseY) > threshold
      ) {
        isDragging.value = true
        // 通知外部拖拽开始
        if (options.onDragStart) options.onDragStart()
      } else {
        return
      }
    }
    // 计算绝对位置（相对于 stage）
    const rootEl = options.rootRefForAbs?.value ?? wrapRef.value
    if (!rootEl) return
    const rect = rootEl.getBoundingClientRect()
    const mouseStageX = (e.clientX - rect.left - panX.value) / (scaleRef.value || 1)
    const mouseStageY = (e.clientY - rect.top - panY.value) / (scaleRef.value || 1)
    const x = mouseStageX - anchorX
    const y = mouseStageY - anchorY
    // 更新altKey状态
    dragAltPressed = e.altKey
    if (options.dragCallback) options.dragCallback(x, y, e.ctrlKey, e.altKey)
  }

  const onDragMove = throttle<(e: MouseEvent) => void>(rawOnDragMove, 16)

  const onDragEnd = () => {
    window.removeEventListener('mousemove', onDragMove)
    window.removeEventListener('mouseup', onDragEnd)
    isDragging.value = false
    if (options.onDragEnd) options.onDragEnd(dragAltPressed)
    anchorX = 0
    anchorY = 0
    dragAltPressed = false
  }

  // 处理容器上的 Drop
  /**
   * 校验拖拽载荷格式
   * 兼容新旧两种格式：
   * - 新格式：componentName (从 @lowcode/materials)
   * - 旧格式：type (向后兼容)
   */
  const isComponentPayload = (v: unknown): v is ComponentPayload => {
    if (!v || typeof v !== 'object') return false
    const obj = v as Record<string, unknown>
    // 核心修复：兼容 componentName (新) 和 type (旧)，且必须为字符串
    return typeof obj.componentName === 'string' || typeof obj.type === 'string'
  }

  const handleDrop = (e: DragEvent) => {
    if (!options.enableDrop) return
    e.preventDefault()
    const data = e.dataTransfer?.getData('application/x-component')
    if (!data) return
    try {
      const item: unknown = JSON.parse(data)
      const el = wrapRef.value
      if (!el) return
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left - panX.value) / (scaleRef.value || 1)
      const y = (e.clientY - rect.top - panY.value) / (scaleRef.value || 1)
      if (isComponentPayload(item)) {
        options.onDrop?.(item, { x, y })
      } else {
        console.warn('Dropped payload is not a ComponentPayload', item)
      }
    } catch (err) {
      console.error('Drop error:', err)
    }
  }

  // 鼠标按下处理
  const handleMouseDown = (e: MouseEvent) => {
    if (options.preventBubble) e.stopPropagation()
    if (options.enablePan) onPanStart(e)
    else if (options.enableDrag) onDragStart(e)
  }

  // 生命周期
  onMounted(() => {
    const el = wrapRef.value
    if (el) {
      if (options.enableZoom !== false)
        el.addEventListener('wheel', handleWheel, { passive: false })
      el.addEventListener('mousedown', handleMouseDown)
      if (options.enableDrop) {
        el.addEventListener('dragover', (e) => e.preventDefault())
        el.addEventListener('drop', handleDrop)
      }
    }
  })

  onBeforeUnmount(() => {
    const el = wrapRef.value
    if (el) {
      if (options.enableZoom !== false) el.removeEventListener('wheel', handleWheel)
      el.removeEventListener('mousedown', handleMouseDown)
      if (options.enableDrop) {
        el.removeEventListener('drop', handleDrop)
      }
    }
    window.removeEventListener('mousemove', onPanMove)
    window.removeEventListener('mouseup', onPanEnd)
    window.removeEventListener('mousemove', onDragMove)
    window.removeEventListener('mouseup', onDragEnd)
  })

  return {
    panX,
    panY,
    isPanning,
    isDragging,
    handleWheel,
    onPanStart,
    onPanMove,
    onPanEnd,
    onDragStart,
    onDragMove,
    onDragEnd,
  }
}
