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
        <!-- V1.5: 使用 FreeRenderer 渲染组件树（包含 Shape 包裹器） -->
        <!-- currentTree 是 Page 根节点，只渲染它的 children -->
        <template v-if="currentTree && currentTree.children && currentTree.children.length > 0">
          <FreeRenderer
            v-for="child in currentTree.children"
            :key="child.id"
            :node="child"
            @open-context-menu="onComponentContextMenu"
            @snap-lines="handleSnapLines"
          />
        </template>

        <!-- 空状态提示 -->
        <div v-else class="empty-canvas-hint">
          <div class="hint-icon">🎨</div>
          <p>从左侧拖入组件开始设计</p>
          <p class="hint-sub">支持拖拽、缩放、旋转和智能吸附</p>
        </div>

        <!-- 吸附辅助线 -->
        <SnapLine v-if="snapLines.length > 0" :lines="snapLines" />

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
import { ref, computed, provide, onMounted, onBeforeUnmount } from 'vue'
import FreeRenderer from './FreeRenderer.vue'
import { useUIStore } from '@/stores/ui'
import { storeToRefs } from 'pinia'
import { useComponent } from '@/stores/component'
import { useCanvasInteraction } from './composables/useCanvasInteraction'
import SnapLine from './Snap/SnapLine.vue'
import ContextMenu from './ContextMenu/ContextMenu.vue'

const wrap = ref<HTMLDivElement | null>(null)

// 向子组件提供画布容器，用于将屏幕坐标映射为 stage 坐标
provide('canvasWrapRef', wrap)

const uiStore = useUIStore()
const {
  canvasWidth: width,
  canvasHeight: height,
  canvasScale: scale,
  canvasSettings: canvasConfig,
} = storeToRefs(uiStore)

// 使用新的组件 Store
const compStore = useComponent()
const { rootNode: currentTree, selectedId, selectedIds } = storeToRefs(compStore)
const { addComponent, selectComponent, clearSelection } = compStore

// ========== Snap Lines State ==========
const snapLines = ref<{ x?: number; y?: number }[]>([])

function handleSnapLines(lines: { x?: number; y?: number }[]) {
  snapLines.value = lines
}

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
  const target = e.target as HTMLElement

  // 只有直接点击 canvas-wrap 或 stage 时才清除选择
  if (
    !target.classList.contains('canvas-wrap') &&
    !target.classList.contains('stage') &&
    !target.classList.contains('world')
  ) {
    return
  }

  // 点击空白处，取消选中
  console.log('[FreeCanvas] Clicked empty space, clearing selection')
  clearSelection()
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation() // Prevent canvas pan

  try {
    const dataStr = e.dataTransfer?.getData('application/x-vela') || '{}'
    const data = JSON.parse(dataStr)

    if (!data.componentName) {
      console.warn('[FreeCanvas] Invalid drop data:', data)
      return
    }

    const el = wrap.value
    if (!el) return

    const rect = el.getBoundingClientRect()
    const scaleValue = scale.value || 1

    // 计算在 stage 坐标系中的位置
    const stageX = (e.clientX - rect.left - panX.value) / scaleValue
    const stageY = (e.clientY - rect.top - panY.value) / scaleValue

    console.log('[FreeCanvas] Drop position - client:', e.clientX, e.clientY)
    console.log('[FreeCanvas] Drop position - stage:', stageX, stageY)
    console.log('[FreeCanvas] Pan:', panX.value, panY.value, 'Scale:', scaleValue)

    // 创建新组件（自由画布模式使用 position: absolute）
    const newId = addComponent(null, {
      id: `comp_${Date.now()}`,
      componentName: data.componentName,
      props: data.props || {},
      style: {
        position: 'absolute',
        left: `${stageX}px`,
        top: `${stageY}px`,
        width: `${data.width || 120}px`,
        height: `${data.height || 80}px`,
        ...(data.style || {}),
      },
      children: [],
    })

    if (newId) {
      selectComponent(newId)
      console.log('[FreeCanvas] Created component:', newId)
      console.log('[FreeCanvas] Current tree:', currentTree.value)
    }
  } catch (err) {
    console.error('[FreeCanvas] Drop error:', err)
  }
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
  const target = e.target as HTMLElement

  // 如果右键点击的是组件，让组件处理
  if (target.closest('[data-id]')) return

  const rect = wrap.value?.getBoundingClientRect()
  if (!rect) return

  const visualX = e.clientX - rect.left
  const visualY = e.clientY - rect.top

  const scaleValue = scale.value || 1
  const stageX = (visualX - panX.value) / scaleValue
  const stageY = (visualY - panY.value) / scaleValue

  menuState.value = {
    x: visualX,
    y: visualY,
    stageX,
    stageY,
    visible: true,
    targetId: undefined,
  }
}

function onComponentContextMenu(payload: { id: string; event: MouseEvent }) {
  const e = payload.event
  const rect = wrap.value?.getBoundingClientRect()
  if (!rect) return

  const visualX = e.clientX - rect.left
  const visualY = e.clientY - rect.top

  menuState.value = {
    x: visualX,
    y: visualY,
    visible: true,
    targetId: payload.id,
  }
}

function hideContextMenu() {
  if (menuState.value.visible) menuState.value.visible = false
}

function onMenuAction(action: string) {
  console.log('[FreeCanvas] Menu action:', action)
  // TODO: Implement menu actions (delete, copy, paste, etc.)
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
  position: relative;
  contain: layout style paint;
}

/* Empty canvas hint */
.empty-canvas-hint {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #909399;
  pointer-events: none;
  user-select: none;
}

.hint-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-canvas-hint p {
  margin: 8px 0;
  font-size: 14px;
}

.hint-sub {
  font-size: 12px;
  color: #c0c4cc;
}
</style>
