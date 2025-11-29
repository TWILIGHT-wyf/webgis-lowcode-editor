import { computed, type CSSProperties, ref, inject, type Ref } from 'vue'
import { useComponent } from '@/stores/component'
import { useSizeStore } from '@/stores/size'
import { storeToRefs } from 'pinia'
import { useCanvasInteraction } from '@/components/Editor/canvasBoard/canvasBoard'
import { throttle, debounce } from '@/utils/throttleDebounce'
import { useSnap } from '../snap/snap'

export function useShape(id: string) {
  const compStore = useComponent()
  const { isDragging } = storeToRefs(compStore)
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
  const isLocked = computed(() => currentComponent.value?.style?.locked ?? false)

  // 全局缩放
  const sizeStore = useSizeStore()
  const { scale } = storeToRefs(sizeStore)

  // 包装器与根容器
  const wrapperRef = ref<HTMLDivElement | null>(null)
  const canvasWrapRef = inject<Ref<HTMLDivElement | null>>('canvasWrapRef')

  // 防抖更新位置
  const debouncedUpdatePosition = debounce(
    updateComponentPosition as (...args: unknown[]) => unknown,
    10,
  ) as (pos: { x: number; y: number }) => void

  const { snapToNeighbors, snapToGrid, boxCache, meComp } = useSnap()

  // 拖拽开始时的原始位置和子组件位置快照
  let dragStartPos = { x: 0, y: 0 }
  let childrenStartPos: Record<string, { x: number; y: number }> = {}

  // 绑定拖拽行为
  useCanvasInteraction(wrapperRef, scale, {
    enableDrag: true,
    preventBubble: true,
    dragThreshold: 5,
    rootRefForAbs: canvasWrapRef as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    dragCallback: (x, y, ctrlPressed) => {
      ;(setSelected as (id: string) => void)(id)
      const comp = currentComponent.value
      if (!comp) return

      // 锁定的组件不能拖动
      if (isLocked.value) return

      // 按住 Ctrl 时对齐网格，否则吸附邻居
      let finalPosition = { x, y }
      if (ctrlPressed) {
        const gridSnap = snapToGrid({ x, y }, 20)
        finalPosition = gridSnap.position
      } else {
        const snap = snapToNeighbors(10, { x, y })
        if (snap) {
          finalPosition = snap.position
        }
      }

      debouncedUpdatePosition(finalPosition)

      // 只有拖拽组合本身时，才同步移动所有子组件
      // 拖拽子组件时，子组件独立移动
      if (comp.type === 'Group' && comp.children) {
        const actualDx = finalPosition.x - dragStartPos.x
        const actualDy = finalPosition.y - dragStartPos.y
        comp.children.forEach((childId) => {
          const child = compStore.componentStore.find((c) => c.id === childId)
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
        // 只有拖拽组合本身时，才保存子组件的初始位置
        if (comp.type === 'Group' && comp.children) {
          childrenStartPos = {}
          comp.children.forEach((childId) => {
            const child = compStore.componentStore.find((c) => c.id === childId)
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

      // 只有按住Alt键才检测父子关系
      if (!altPressed) return

      // 检测是否拖入了容器组件
      const comp = currentComponent.value
      if (!comp) return

      // 容器类型列表（以小写形式列出以便不区分大小写比较）
      const containerTypes = ['panel', 'row', 'col', 'flex', 'grid', 'modal', 'tabs', 'group']

      // 查找所有容器组件（类型比较不区分大小写）
      const containers = compStore.componentStore.filter((c) => {
        if (!c.type) return false
        const t = String(c.type).toLowerCase()
        return containerTypes.includes(t) && c.id !== comp.id && c.id !== comp.groupId
      })

      // 计算当前组件的中心点
      const compCenterX = comp.position.x + comp.size.width / 2
      const compCenterY = comp.position.y + comp.size.height / 2

      // 检测中心点是否在容器内，按zindex从大到小排序
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
        if (!targetContainer) return

        // 如果当前组件已经有父组件，且是同一个，则不做处理
        if (comp.groupId === targetContainer.id) return

        // 移除旧的父子关系
        if (comp.groupId) {
          const oldParent = compStore.componentStore.find((c) => c.id === comp.groupId)
          if (oldParent && oldParent.children) {
            oldParent.children = oldParent.children.filter((cid) => cid !== comp.id)
          }
        }

        // 将绝对坐标转换为相对于父组件的相对坐标
        const relativeX = comp.position.x - targetContainer.position.x
        const relativeY = comp.position.y - targetContainer.position.y
        comp.position.x = relativeX
        comp.position.y = relativeY

        // 建立新的父子关系
        if (!targetContainer.children) {
          targetContainer.children = []
        }
        if (!targetContainer.children.includes(comp.id)) {
          targetContainer.children.push(comp.id)
        }
        comp.groupId = targetContainer.id

        // 初始化父组件的布局配置
        if (!targetContainer.layout) {
          targetContainer.layout = {
            mode: 'absolute',
            gap: 8,
            columns: 2,
            align: 'start',
            padding: 0,
          }
        }

        // 提交更改
        compStore.commitDebounced()
      }
    },
  })

  const isSelected = computed(() => compStore.isSelected(id))

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

  const isMultiSelected = computed(() => {
    const selectedCount = compStore.selectedIds.length
    return selectedCount > 1 && compStore.isSelected(id)
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
  let childrenStartState: Record<
    string,
    { position: { x: number; y: number }; size: { width: number; height: number } }
  > = {}

  let isCtrlPressed = false

  const onHandleMouseDown = (e: MouseEvent, handle: HandleMeta) => {
    e.preventDefault()
    // 锁定的组件不能缩放
    if (isLocked.value) return
    ;(setSelected as (id: string) => void)(id)
    startMouseX = e.clientX
    startMouseY = e.clientY
    startSize = { ...size.value }
    startPos = { ...position.value }
    currentHandle = handle.id
    isCtrlPressed = e.ctrlKey

    // 保存子组件的初始状态
    const comp = currentComponent.value
    if (comp && comp.type === 'Group' && comp.children) {
      childrenStartState = {}
      comp.children.forEach((childId) => {
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
    const GRID_SIZE = 20
    const myId = meComp.value.id
    const guideXs: number[] = []
    const guideYs: number[] = []

    // 按住Ctrl时优先吸附网格
    if (isCtrlPressed) {
      // 对网格吸附
      const gridX = Math.round(newX / GRID_SIZE) * GRID_SIZE
      const gridY = Math.round(newY / GRID_SIZE) * GRID_SIZE
      const gridRight = Math.round((newX + newWidth) / GRID_SIZE) * GRID_SIZE
      const gridBottom = Math.round((newY + newHeight) / GRID_SIZE) * GRID_SIZE

      if (currentHandle.includes('w') && Math.abs(newX - gridX) < SNAP_TOL) {
        const rightFixed = startPos.x + startSize.width
        newX = gridX
        newWidth = Math.max(10, rightFixed - newX)
      }
      if (currentHandle.includes('e') && Math.abs(newX + newWidth - gridRight) < SNAP_TOL) {
        newWidth = Math.max(10, gridRight - newX)
      }
      if (currentHandle.includes('n') && Math.abs(newY - gridY) < SNAP_TOL) {
        const bottomFixed = startPos.y + startSize.height
        newY = gridY
        newHeight = Math.max(10, bottomFixed - newY)
      }
      if (currentHandle.includes('s') && Math.abs(newY + newHeight - gridBottom) < SNAP_TOL) {
        newHeight = Math.max(10, gridBottom - newY)
      }
    } else {
      // 吸附到其他组件
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
    }

    updateComponentSize({ width: newWidth, height: newHeight })
    updateComponentPosition({ x: newX, y: newY })

    // 如果是组合，同步缩放所有子组件
    const comp = currentComponent.value
    if (comp && comp.type === 'Group' && comp.children) {
      const scaleX = newWidth / startSize.width
      const scaleY = newHeight / startSize.height

      comp.children.forEach((childId) => {
        const child = compStore.componentStore.find((c) => c.id === childId)
        const childStart = childrenStartState[childId]
        if (child && childStart) {
          // 计算子组件相对于组合的偏移（使用初始状态）
          const relX = childStart.position.x - startPos.x
          const relY = childStart.position.y - startPos.y

          // 应用缩放
          child.position.x = newX + relX * scaleX
          child.position.y = newY + relY * scaleY
          child.size.width = childStart.size.width * scaleX
          child.size.height = childStart.size.height * scaleY
        }
      })
    }
  }
  const throttledHandleMouseMove = throttle(onHandleMouseMove as any, 16) // eslint-disable-line @typescript-eslint/no-explicit-any
  const onHandleMouseUp = () => {
    isDragging.value = false
    window.removeEventListener('mousemove', throttledHandleMouseMove)
    window.removeEventListener('mouseup', onHandleMouseUp)
    currentHandle = ''
    childrenStartState = {}
  }

  // 旋转
  let startAngle = 0
  let centerX = 0,
    centerY = 0
  const onRotateMouseDown = (e: MouseEvent) => {
    e.preventDefault()
    // 锁定的组件不能旋转
    if (isLocked.value) return
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
    isLocked,
    wrapperStyle,
    borderStyle,
    handles,
    onHandleMouseDown,
    onRotateMouseDown,
    contentClass,
    contentStyle,
  }
}
