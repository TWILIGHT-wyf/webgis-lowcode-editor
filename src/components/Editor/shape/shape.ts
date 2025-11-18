import { computed, type CSSProperties, ref, inject, type Ref } from 'vue'
import { useComponent } from '@/stores/component'
import { useSizeStore } from '@/stores/size'
import { storeToRefs } from 'pinia'
import { useCanvasInteraction } from '@/components/Editor/canvasBoard/canvasBoard'
import { throttle, debounce } from '@/utils/throttleDebounce'
import { useSnap } from '../snap/snap'

export function useShape(id: string) {
  const compStore = useComponent()
  const { selectComponent, isDragging } = storeToRefs(compStore)
  const {
    selectedId: setSelected,
    updateComponentSize,
    updateComponentRotation,
    updateComponentPosition,
  } = compStore

  // 当前组件实例与数据
  const currentComponent = computed(() => compStore.componentStore.find((comp) => comp.id === id))
  const position = computed(() => currentComponent.value?.position || { x: 0, y: 0 })
  const size = computed(() => currentComponent.value?.size || { width: 100, height: 100 })
  const rotation = computed(() => currentComponent.value?.rotation ?? 0)
  const zIndex = computed(() => currentComponent.value?.zindex ?? 0)

  // 全局缩放
  const sizeStore = useSizeStore()
  const { scale } = storeToRefs(sizeStore)

  // 包装器与根容器
  const wrapperRef = ref<HTMLDivElement | null>(null)
  const canvasWrapRef = inject<Ref<HTMLDivElement | null>>('canvasWrapRef')

  // 防抖更新位置（拖拽）
  const debouncedUpdatePosition = debounce(
    updateComponentPosition as (...args: unknown[]) => unknown,
    10,
  ) as (pos: { x: number; y: number }) => void

  const { snapToNeighbors, boxCache, meComp } = useSnap()

  // 绑定拖拽（移动）行为
  useCanvasInteraction(wrapperRef, scale, {
    enableDrag: true,
    preventBubble: true,
    dragThreshold: 5,
    rootRefForAbs: canvasWrapRef as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    dragCallback: (x, y) => {
      ;(setSelected as (id: string) => void)(id)
      // 先计算吸附后的理想位置，再更新
      const snap = snapToNeighbors(10, { x, y })
      if (snap) {
        debouncedUpdatePosition(snap.position)
      } else {
        debouncedUpdatePosition({ x, y })
      }
    },
    onDragStart: () => {
      isDragging.value = true
    },
    onDragEnd: () => {
      isDragging.value = false
    },
  })

  const isSelected = computed(() => selectComponent.value?.id === id)

  // 样式
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

  // 缩放
  interface HandleMeta {
    id: string
    class: string
  }
  let startMouseX = 0,
    startMouseY = 0
  let startSize = { width: 0, height: 0 }
  let startPos = { x: 0, y: 0 }
  let currentHandle = ''
  const onHandleMouseDown = (e: MouseEvent, handle: HandleMeta) => {
    e.preventDefault()
    ;(setSelected as (id: string) => void)(id)
    startMouseX = e.clientX
    startMouseY = e.clientY
    startSize = { ...size.value }
    startPos = { ...position.value }
    currentHandle = handle.id
    window.addEventListener('mousemove', throttledHandleMouseMove)
    window.addEventListener('mouseup', onHandleMouseUp)
  }
  const onHandleMouseMove = (e: MouseEvent) => {
    isDragging.value = true
    const dx = (e.clientX - startMouseX) / (scale.value || 1)
    const dy = (e.clientY - startMouseY) / (scale.value || 1)
    // 新尺寸与位置基于按下时的原始值计算
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

    // 最小尺寸限制
    if (newWidth < 10) {
      if (currentHandle.includes('w')) {
        newX = startPos.x + (startSize.width - 10)
      }
      newWidth = 10
    }
    if (newHeight < 10) {
      if (currentHandle.includes('n')) {
        newY = startPos.y + (startSize.height - 10)
      }
      newHeight = 10
    }

    // —— 缩放吸附 ——
    const SNAP_TOL = 10
    const myId = meComp.value.id
    const guideXs: number[] = []
    const guideYs: number[] = []
    boxCache.value.forEach((b, id) => {
      if (!id || id === myId) return
      guideXs.push(b.minx, b.cx, b.maxx, ...b.corners.map((p) => p.x))
      guideYs.push(b.miny, b.cy, b.maxy, ...b.corners.map((p) => p.y))
    })

    // 水平吸附（处理 e/w 手柄）
    if (currentHandle.includes('e') || currentHandle.includes('w')) {
      if (currentHandle.includes('e')) {
        const target = newX + newWidth
        let best = { dist: SNAP_TOL + 1, gx: target }
        for (const gx of guideXs) {
          const d = Math.abs(gx - target)
          if (d < best.dist) best = { dist: d, gx }
        }
        if (best.dist <= SNAP_TOL) {
          const snappedRight = best.gx
          newWidth = Math.max(10, snappedRight - newX)
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
          newWidth = Math.max(10, rightFixed - newX)
          if (newWidth === 10) {
            newX = rightFixed - 10
          }
        }
      }
    }

    // 垂直吸附（处理 n/s 手柄）
    if (currentHandle.includes('s') || currentHandle.includes('n')) {
      if (currentHandle.includes('s')) {
        const target = newY + newHeight
        let best = { dist: SNAP_TOL + 1, gy: target }
        for (const gy of guideYs) {
          const d = Math.abs(gy - target)
          if (d < best.dist) best = { dist: d, gy }
        }
        if (best.dist <= SNAP_TOL) {
          const snappedBottom = best.gy
          newHeight = Math.max(10, snappedBottom - newY)
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
          newHeight = Math.max(10, bottomFixed - newY)
          if (newHeight === 10) {
            newY = bottomFixed - 10
          }
        }
      }
    }

    updateComponentSize({ width: newWidth, height: newHeight })
    updateComponentPosition({ x: newX, y: newY })
  }
  const throttledHandleMouseMove = throttle(onHandleMouseMove as any, 16) // eslint-disable-line @typescript-eslint/no-explicit-any
  const onHandleMouseUp = () => {
    isDragging.value = false
    window.removeEventListener('mousemove', throttledHandleMouseMove)
    window.removeEventListener('mouseup', onHandleMouseUp)
    currentHandle = ''
  }

  // 旋转
  let startAngle = 0
  let centerX = 0,
    centerY = 0
  const onRotateMouseDown = (e: MouseEvent) => {
    e.preventDefault()
    ;(setSelected as (id: string) => void)(id)
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
  const throttledRotateMouseMove = throttle(onRotateMouseMove as any, 16) // eslint-disable-line @typescript-eslint/no-explicit-any
  const onRotateMouseUp = () => {
    isDragging.value = false
    window.removeEventListener('mousemove', throttledRotateMouseMove)
    window.removeEventListener('mouseup', onRotateMouseUp)
  }

  // —— 动画应用到 shape-content ——
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

  return {
    wrapperRef,
    isSelected,
    wrapperStyle,
    borderStyle,
    handles,
    onHandleMouseDown,
    onRotateMouseDown,
    contentClass,
    contentStyle,
  }
}
