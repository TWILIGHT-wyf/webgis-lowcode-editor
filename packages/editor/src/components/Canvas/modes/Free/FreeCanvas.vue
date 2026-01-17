<template>
  <div
    class="canvas-wrap"
    ref="wrap"
    :class="{ dragging: isPanning }"
    data-testid="canvas-board-v2"
    @dragover.prevent
    @drop="handleDrop"
    @contextmenu.prevent="onCanvasContextMenu"
    @click="handleCanvasClick"
  >
    <div class="world" :style="worldStyle">
      <div class="stage" :style="stageStyle">
        <!-- V1.5: 使用递归渲染器渲染树形结构 -->
        <RecursiveRenderer v-if="currentTree" :node="currentTree" />

        <!-- 吸附辅助线 (纯 UI 组件) -->
        <SnapLine v-if="isDragging" :lines="snapLines" />

        <!-- 右键菜单 -->
        <ContextMenu
          :x="menuState.x"
          :y="menuState.y"
          :visible="menuState.visible"
          :target-id="menuState.targetId"
          @action="onMenuAction"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, provide, onMounted, onBeforeUnmount, watch } from 'vue'
import { RecursiveRenderer } from '@vela/renderer'
import { useSizeStore } from '@/stores/size'
import { storeToRefs } from 'pinia'
import { useComponentStore } from '@/stores/componentTree'
import { useComponent } from '@/stores/component'
import { useCanvasInteraction } from './composables/useCanvasInteraction'
import { useSnap } from './composables/useSnap'
import SnapLine from './Snap/SnapLine.vue'
import ContextMenu from './ContextMenu/contextMenu.vue'

const wrap = ref<HTMLDivElement | null>(null)

// 向子组件提供画布容器，用于将屏幕坐标映射为 stage 坐标
provide('canvasWrapRef', wrap)

const sizeStore = useSizeStore()
const { width, height, scale, canvasConfig } = storeToRefs(sizeStore)

// V1.5: 使用新的树形 Store
const compStore = useComponentStore()
const { currentTree, selectedId } = storeToRefs(compStore)
const { addComponent, setSelected, clearSelection, setDragging } = compStore

// V1旧 Store 用于获取 isDragging 和 snap 数据
const oldCompStore = useComponent()
const { isDragging, selectComponent } = storeToRefs(oldCompStore)

// ========== Snap Logic ==========
const { snapToNeighbors } = useSnap()
const snapLines = ref<{ x?: number; y?: number }[]>([])

// 监听拖拽状态和选中组件，更新吸附线
watch(
  () => {
    const c = selectComponent.value
    return isDragging.value && c
      ? [c.position.x, c.position.y, c.size.width, c.size.height, c.rotation, isDragging.value]
      : null
  },
  () => {
    if (!selectComponent.value || !isDragging.value) {
      snapLines.value = []
      return
    }
    const snap = snapToNeighbors(10)
    if (snap) {
      snapLines.value = snap.lines
    } else {
      snapLines.value = []
    }
  },
  { immediate: true },
)

// ========== Interaction ==========
const { panX, panY, isPanning } = useCanvasInteraction(wrap, scale, {
  enablePan: true,
  enableZoom: true,
  enableDrop: true,
})

// 向子组件提供画布平移量，用于组件拖拽时坐标转换
provide('canvasPanX', panX)
provide('canvasPanY', panY)

// ========== Event Handlers ==========
const handleCanvasClick = (e: MouseEvent) => {
  e.stopPropagation()
  const target = e.target as HTMLElement

  const nodeEl = target.closest('[data-id]')
  if (nodeEl) {
    const id = nodeEl.getAttribute('data-id')
    if (id) {
      setSelected(id)
      return
    }
  }

  clearSelection()
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()

  try {
    const dataStr = e.dataTransfer?.getData('application/x-component') || '{}'
    const data = JSON.parse(dataStr)

    if (!data.componentName) {
      console.warn('[CanvasBoard] Invalid drop data:', data)
      return
    }

    const el = wrap.value
    if (!el) return

    const rect = el.getBoundingClientRect()
    const scaleValue = scale.value || 1

    const stageX = (e.clientX - rect.left - panX.value) / scaleValue
    const stageY = (e.clientY - rect.top - panY.value) / scaleValue

    const newId = addComponent({
      componentName: data.componentName,
      props: data.props || {},
      style: {
        position: 'absolute',
        left: `${stageX}px`,
        top: `${stageY}px`,
        width: `${data.width || 100}px`,
        height: `${data.height || 100}px`,
        ...(data.style || {}),
      },
      children: [],
    })

    if (newId) {
      setSelected(newId)
    }
  } catch (err) {
    console.error('[CanvasBoard] Drop error:', err)
  }

  setDragging(false)
}

// ========== Context Menu Logic ==========
const menuState = ref<{
  x: number
  y: number
  stageX?: number
  stageY?: number
  visible: boolean
  targetId?: string
}>({
  x: 0,
  y: 0,
  visible: false,
})

function onCanvasContextMenu(e: MouseEvent) {
  if ((e.target as HTMLElement).closest('.shape')) return

  const rect = wrap.value?.getBoundingClientRect()
  if (!rect) return

  const visualX = e.clientX - rect.left
  const visualY = e.clientY - rect.top

  let stageX = visualX
  let stageY = visualY
  try {
    const worldEl = wrap.value?.querySelector('.world') as HTMLElement | null
    if (worldEl) {
      const style = window.getComputedStyle(worldEl)
      const tf = style.transform
      if (tf && tf !== 'none') {
        const m = tf.match(/matrix\(([^)]+)\)/)
        if (m && m[1]) {
          const parts = m[1].split(',').map((s) => parseFloat(s.trim()))
          const a = parts[0] || 1
          const e2 = parts[4] || 0
          const f2 = parts[5] || 0
          stageX = (visualX - e2) / a
          stageY = (visualY - f2) / a
        }
      }
    }
  } catch {
    // ignore
  }

  menuState.value = { x: visualX, y: visualY, stageX, stageY, visible: true, targetId: undefined }
}

function hideContextMenu() {
  if (menuState.value.visible) menuState.value.visible = false
}

function onMenuAction(action: string) {
  const {
    removeComponent,
    removeMultipleComponents,
    copy,
    copyMultiple,
    cut,
    cutMultiple,
    paste,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    groupComponents,
    ungroupComponents,
  } = oldCompStore
  const { selectedIds } = storeToRefs(oldCompStore)

  if (menuState.value.targetId) {
    const targetId = menuState.value.targetId
    const isMultiSelect = selectedIds.value.length > 1

    switch (action) {
      case 'delete':
        if (isMultiSelect) {
          removeMultipleComponents([...selectedIds.value])
        } else {
          removeComponent(targetId)
        }
        break
      case 'copy':
        if (isMultiSelect) {
          copyMultiple([...selectedIds.value])
        } else {
          copy(targetId)
        }
        break
      case 'cut':
        if (isMultiSelect) {
          cutMultiple([...selectedIds.value])
        } else {
          cut(targetId)
        }
        break
      case 'paste':
        paste({
          x: menuState.value.stageX ?? menuState.value.x,
          y: menuState.value.stageY ?? menuState.value.y,
        })
        break
      case 'bringForward':
        if (isMultiSelect) {
          selectedIds.value.forEach((id: string) => bringForward(id))
        } else {
          bringForward(targetId)
        }
        break
      case 'sendBackward':
        if (isMultiSelect) {
          selectedIds.value.forEach((id: string) => sendBackward(id))
        } else {
          sendBackward(targetId)
        }
        break
      case 'bringToFront':
        if (isMultiSelect) {
          selectedIds.value.forEach((id: string) => bringToFront(id))
        } else {
          bringToFront(targetId)
        }
        break
      case 'sendToBack':
        if (isMultiSelect) {
          selectedIds.value.forEach((id: string) => sendToBack(id))
        } else {
          sendToBack(targetId)
        }
        break
      case 'group':
        if (isMultiSelect) {
          groupComponents([...selectedIds.value])
        }
        break
      case 'ungroup':
        const comp = oldCompStore.componentStore.find((c: any) => c.id === targetId)
        if (comp && comp.type === 'Group') {
          ungroupComponents(targetId)
        }
        break
    }
  } else {
    if (action === 'paste') {
      paste({
        x: menuState.value.stageX ?? menuState.value.x,
        y: menuState.value.stageY ?? menuState.value.y,
      })
    }
  }
  hideContextMenu()
}

function handleGlobalClick(e: MouseEvent) {
  const el = document.querySelector('.ctx-menu')
  if (!el) return
  if (menuState.value.visible && !el.contains(e.target as Node)) {
    hideContextMenu()
  }
}

onMounted(() => {
  window.addEventListener('mousedown', handleGlobalClick)
  window.addEventListener('scroll', hideContextMenu, true)
})

onBeforeUnmount(() => {
  window.removeEventListener('mousedown', handleGlobalClick)
  window.removeEventListener('scroll', hideContextMenu, true)
})

// ========== Styles ==========
const stageStyle = computed(() => {
  const config = canvasConfig.value
  const baseStyle: Record<string, string> = {
    width: width.value + 'px',
    height: height.value + 'px',
    backgroundColor: config.backgroundColor,
  }

  if (config.backgroundImage) {
    baseStyle.backgroundImage = `url(${config.backgroundImage})`
    baseStyle.backgroundSize = 'cover'
    baseStyle.backgroundPosition = 'center'
    baseStyle.backgroundRepeat = 'no-repeat'
  }

  if (config.showGrid) {
    baseStyle['--grid-size'] = config.gridSize + 'px'
    baseStyle['--grid-major'] = config.gridMajorSize + 'px'
    baseStyle['--grid-color'] = config.gridColor
    baseStyle['--grid-major-color'] = config.gridMajorColor
  } else {
    baseStyle['--grid-color'] = 'transparent'
    baseStyle['--grid-major-color'] = 'transparent'
  }

  return baseStyle
})

const worldStyle = computed(() => ({
  transform: `translate3d(${panX.value}px, ${panY.value}px, 0) scale(${scale.value})`,
  transformOrigin: '0 0',
  willChange: isPanning.value ? 'transform' : 'auto',
}))
</script>

<style scoped>
.canvas-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  cursor: grab;
  transform: translateZ(0);
}

.canvas-wrap.dragging {
  cursor: grabbing;
}

.world {
  will-change: transform;
  transform-origin: 0 0;
  contain: layout style;
}

.canvas-wrap.dragging .world {
  pointer-events: none;
}

.stage {
  background-color: var(--grid-bg);
  background-image:
    linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
    linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px),
    linear-gradient(to right, var(--grid-major-color) 1px, transparent 1px),
    linear-gradient(to bottom, var(--grid-major-color) 1px, transparent 1px);
  background-size:
    var(--grid-size) var(--grid-size),
    var(--grid-size) var(--grid-size),
    var(--grid-major) var(--grid-major),
    var(--grid-major) var(--grid-major);
  background-position:
    0 0,
    0 0,
    0 0,
    0 0;
  display: grid;
  position: relative;
  contain: layout style paint;
}

/* V1.5: 选中高亮样式 */
:deep(.lowcode-node:hover) {
  outline: 1px dashed #1890ff;
}

:deep(.lowcode-node.selected),
:deep([data-id].selected) {
  outline: 2px solid #1890ff;
}
</style>
