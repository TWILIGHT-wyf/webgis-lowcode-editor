/**
 * Advanced shape drag with container detection
 *
 * Extends base useCanvasInteraction with:
 * - Group component child synchronization
 * - Alt+drag container detection
 * - Drag start/end state tracking
 */

import { ref, type Ref } from 'vue'
import { useCanvasInteraction } from '@/components/Canvas/modes/Free/composables/useCanvasInteraction'
import type { NodeSchema } from '@vela/core'
import { useComponent } from '@/stores/component'

export interface ShapeDragOptions {
  scale: Ref<number>
  rootRefForAbs?: Ref<HTMLElement | null>
  externalPanX?: Ref<number>
  externalPanY?: Ref<number>
  enableDrag?: boolean
  dragThreshold?: number
  onDragStart?: () => void
  onDragEnd?: (altPressed: boolean) => void
}

export interface ShapeDragResult {
  isDragging: Ref<boolean>
  isPanning: Ref<boolean>
}

/**
 * Extended node interface with editor-only style properties
 */
export interface EditorNodeStyle {
  x?: number
  y?: number
  width?: number
  height?: number
  rotation?: number
  zIndex?: number
  locked?: boolean
}

export function useShapeDrag(
  wrapperRef: Ref<HTMLElement | null>,
  options: ShapeDragOptions,
): ShapeDragResult {
  const {
    scale,
    rootRefForAbs,
    externalPanX,
    externalPanY,
    enableDrag = true,
    dragThreshold = 5,
    onDragStart: externalOnDragStart,
    onDragEnd: externalOnDragEnd,
  } = options

  const compStore = useComponent()

  // Drag state tracking
  const isDragging = ref<boolean>(false)
  const dragStartPos = ref<{ x: number; y: number }>({ x: 0, y: 0 })
  const childrenStartPos = ref<Record<string, { x: number; y: number }>>({})

  // Use base canvas interaction
  const canvasInteraction = useCanvasInteraction(wrapperRef, scale, {
    enableDrag,
    dragThreshold,
    rootRefForAbs,
    externalPanX,
    externalPanY,
    dragCallback: (x: number, y: number, ctrlPressed: boolean) => {
      onShapeDragMove(x, y, ctrlPressed)
    },
  })

  const { isPanning } = canvasInteraction

  // ========== Shape Drag Logic ==========

  function onShapeDragMove(x: number, y: number, _ctrlPressed: boolean) {
    const comp = getCurrentComponent()
    if (!comp) return

    // Additional logic for Group component children
    if (isGroupComponent(comp) && comp.children) {
      const actualDx = x - dragStartPos.value.x
      const actualDy = y - dragStartPos.value.y

      for (const child of comp.children) {
        const childId = child.id
        const startPos = childrenStartPos.value[childId]
        if (startPos && child.style) {
          child.style.x = startPos.x + actualDx
          child.style.y = startPos.y + actualDy
        }
      }
    }
  }

  function onShapeDragStart() {
    isDragging.value = true
    const comp = getCurrentComponent()
    if (!comp) return

    const style = comp.style as EditorNodeStyle | undefined
    dragStartPos.value = {
      x: style?.x ?? 0,
      y: style?.y ?? 0,
    }

    if (isGroupComponent(comp) && comp.children) {
      childrenStartPos.value = {}
      for (const child of comp.children) {
        const childStyle = child.style as EditorNodeStyle | undefined
        childrenStartPos.value[child.id] = {
          x: childStyle?.x ?? 0,
          y: childStyle?.y ?? 0,
        }
      }
    }

    // Call external callback
    externalOnDragStart?.()
  }

  function onShapeDragEnd(altPressed: boolean) {
    isDragging.value = false
    childrenStartPos.value = {}

    // Alt+drag: container detection
    if (!altPressed) {
      externalOnDragEnd?.(altPressed)
      return
    }

    const comp = getCurrentComponent()
    if (comp) {
      moveComponentToContainer(comp)
    }

    externalOnDragEnd?.(altPressed)
  }

  // ========== Helper Functions ==========

  function getCurrentComponent(): NodeSchema | null {
    const wrapperEl = wrapperRef.value
    if (!wrapperEl) return null

    const componentId = wrapperEl.getAttribute('data-component-id')
    if (!componentId || !compStore.rootNode) return null

    return compStore.findNodeById(compStore.rootNode, componentId)
  }

  function isGroupComponent(comp: NodeSchema | null): boolean {
    if (!comp) return false
    return comp.componentName === 'Group' || comp.componentName === 'group'
  }

  function moveComponentToContainer(comp: NodeSchema): void {
    if (!compStore.rootNode) return

    // Find valid containers using tree traversal
    const containerTypes = [
      'panel',
      'row',
      'col',
      'flex',
      'grid',
      'modal',
      'tabs',
      'group',
      'container',
    ]
    const containers: NodeSchema[] = []

    compStore.traverse(compStore.rootNode, (node) => {
      const name = node.componentName.toLowerCase()
      if (containerTypes.includes(name) && node.id !== comp.id) {
        containers.push(node)
      }
    })

    const compStyle = comp.style as EditorNodeStyle | undefined
    const compX = compStyle?.x ?? 0
    const compY = compStyle?.y ?? 0
    const compWidth = compStyle?.width ?? 100
    const compHeight = compStyle?.height ?? 100
    const compCenterX = compX + compWidth / 2
    const compCenterY = compY + compHeight / 2

    // Find containers that contain the component center
    const hitContainers = containers
      .filter((c) => {
        const cStyle = c.style as EditorNodeStyle | undefined
        const cX = cStyle?.x ?? 0
        const cY = cStyle?.y ?? 0
        const cWidth = cStyle?.width ?? 100
        const cHeight = cStyle?.height ?? 100

        return (
          compCenterX >= cX &&
          compCenterX <= cX + cWidth &&
          compCenterY >= cY &&
          compCenterY <= cY + cHeight
        )
      })
      .sort((a, b) => {
        const aStyle = a.style as EditorNodeStyle | undefined
        const bStyle = b.style as EditorNodeStyle | undefined
        return (bStyle?.zIndex ?? 0) - (aStyle?.zIndex ?? 0)
      })

    if (hitContainers.length === 0) return

    const targetContainer = hitContainers[0]

    // Find current parent
    const currentParent = compStore.findParentNode(compStore.rootNode, comp.id)

    // Don't move if already in the same container
    if (currentParent?.id === targetContainer.id) return

    // Calculate relative position
    const targetStyle = targetContainer.style as EditorNodeStyle | undefined
    const targetX = targetStyle?.x ?? 0
    const targetY = targetStyle?.y ?? 0

    // Use moveComponent from store
    if (!targetContainer.children) {
      targetContainer.children = []
    }

    compStore.moveComponent(comp.id, targetContainer.id, targetContainer.children.length)

    // Update position to be relative to new parent
    if (comp.style) {
      comp.style.x = compX - targetX
      comp.style.y = compY - targetY
    }

    console.log(`[useShapeDrag] Moved ${comp.id} to container ${targetContainer.id}`)
  }

  return {
    isDragging,
    isPanning,
  }
}
