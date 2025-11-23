import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue'
import { throttle } from '@/utils/throttleDebounce'

export function useCanvasInteraction(
  wrapRef: Ref<HTMLDivElement | null>,
  scaleRef: Ref<number>,
  options: {
    enableZoom?: boolean
    enablePan?: boolean
    enableDrag?: boolean
    // 开启在容器上监听 drop，并通过回调抛出落点
    enableDrop?: boolean
    onDrop?: (data: unknown, position: { x: number; y: number }) => void
    dragCallback?: (x: number, y: number, ctrlPressed: boolean) => void
    preventBubble?: boolean
    dragThreshold?: number
    rootRefForAbs?: Ref<HTMLDivElement | null>
    onDragStart?: () => void
    onDragEnd?: () => void
  } = {},
) {
  const panX = ref(0)
  const panY = ref(0)
  const isPanning = ref(false)
  const isDragging = ref(false)

  const clamp = (n: number, min: number, max: number) => Math.min(Math.max(min, n), max)

  // 滚轮缩放
  const handleWheel = (e: WheelEvent) => {
    if (options.enableZoom === false) return
    e.preventDefault()
    const factor = Math.pow(1.0015, e.deltaY)
    scaleRef.value = clamp(scaleRef.value * factor, 0.1, 5)
  }

  // 拖拽平移
  let startMouseX = 0,
    startMouseY = 0
  let startPanX = 0,
    startPanY = 0
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
    panX.value = startPanX + (e.clientX - startMouseX)
    panY.value = startPanY + (e.clientY - startMouseY)
  }
  const onPanEnd = () => {
    isPanning.value = false
    window.removeEventListener('mousemove', onPanMove)
    window.removeEventListener('mouseup', onPanEnd)
  }

  // 组件拖拽
  let startDragMouseX = 0
  let startDragMouseY = 0
  let anchorX = 0
  let anchorY = 0
  const onDragStart = (e: MouseEvent) => {
    if (e.button !== 0 || !options.enableDrag) return
    isDragging.value = false
    startDragMouseX = e.clientX
    startDragMouseY = e.clientY

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
  const onDragMove = throttle(
    ((e: MouseEvent) => {
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
      if (options.dragCallback) options.dragCallback(x, y, e.ctrlKey)
    }) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    16,
  )

  const onDragEnd = () => {
    window.removeEventListener('mousemove', onDragMove)
    window.removeEventListener('mouseup', onDragEnd)
    isDragging.value = false
    if (options.onDragEnd) options.onDragEnd()
    anchorX = 0
    anchorY = 0
  }

  // 处理容器上的 Drop
  const handleDrop = (e: DragEvent) => {
    if (!options.enableDrop) return
    e.preventDefault()
    const data = e.dataTransfer?.getData('application/x-component')
    if (!data) return
    try {
      const item = JSON.parse(data)
      const el = wrapRef.value
      if (!el) return
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left - panX.value) / (scaleRef.value || 1)
      const y = (e.clientY - rect.top - panY.value) / (scaleRef.value || 1)
      if (options.onDrop) options.onDrop(item as unknown, { x, y })
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
