import { computed, type CSSProperties, ref, inject, type Ref } from 'vue'
import { useComponent } from '@/stores/component'
import { useSizeStore } from '@/stores/size'
import { storeToRefs } from 'pinia'
import { useCanvasInteraction } from '@/components/Editor/canvasBoard'
import { throttle, debounce } from '@/utils/throttleDebounce'
import { useSnap } from './snap'

/**
 * 组合式函数：封装 Shape 组件的交互与状态
 * - 选择/样式/拖拽/缩放/旋转
 * 使用方式：
 * const {
 *   wrapperRef, isSelected, wrapperStyle, borderStyle, handles,
 *   onHandleMouseDown, onRotateMouseDown
 * } = useShape(props.id)
 */
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
  const rotation = computed(() => currentComponent.value?.rotation || '0deg')
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

  const { snapToNeighbors } = useSnap()

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
        transform: `rotate(${rotation.value})`,
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
  let currentHandle = ''
  const onHandleMouseDown = (e: MouseEvent, handle: HandleMeta) => {
    e.preventDefault()
    ;(setSelected as (id: string) => void)(id)
    startMouseX = e.clientX
    startMouseY = e.clientY
    startSize = { ...size.value }
    currentHandle = handle.id
    window.addEventListener('mousemove', throttledHandleMouseMove)
    window.addEventListener('mouseup', onHandleMouseUp)
  }
  const onHandleMouseMove = (e: MouseEvent) => {
    isDragging.value = true
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
    const currentRotationDeg =
      typeof rotation.value === 'number' ? rotation.value : parseFloat(rotation.value || '0')
    startAngle =
      Math.atan2(e.clientY - centerY, e.clientX - centerX) - (currentRotationDeg * Math.PI) / 180
    window.addEventListener('mousemove', throttledRotateMouseMove)
    window.addEventListener('mouseup', onRotateMouseUp)
  }
  const onRotateMouseMove = (e: MouseEvent) => {
    isDragging.value = true
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) - startAngle
    const deg = (angle * 180) / Math.PI
    updateComponentRotation(`${deg}deg`)
  }
  const throttledRotateMouseMove = throttle(onRotateMouseMove as any, 16) // eslint-disable-line @typescript-eslint/no-explicit-any
  const onRotateMouseUp = () => {
    isDragging.value = false
    window.removeEventListener('mousemove', throttledRotateMouseMove)
    window.removeEventListener('mouseup', onRotateMouseUp)
  }

  return {
    // Refs & state
    wrapperRef,
    isSelected,
    // Styles
    wrapperStyle,
    borderStyle,
    handles,
    // Handlers
    onHandleMouseDown,
    onRotateMouseDown,
  }
}
