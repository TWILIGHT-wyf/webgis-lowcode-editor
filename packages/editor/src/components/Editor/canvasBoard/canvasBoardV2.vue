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

        <!-- 吸附辅助线 -->
        <Snap ref="snapref" v-if="isDragging" />

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
import { RecursiveRenderer } from '@vela/renderer'
import { useSizeStore } from '@/stores/size'
import { storeToRefs } from 'pinia'
import { useComponentStore } from '@/stores/componentTree'
import { useCanvasInteraction } from '@/components/Editor/canvasBoard/canvasBoard'
import { useContextMenu } from '@/components/Editor/contextMenu/contextMenu'
import Snap from '../snap/snap.vue'
import ContextMenu from '../contextMenu/contextMenu.vue'

const wrap = ref<HTMLDivElement | null>(null)

// 向子组件提供画布容器，用于将屏幕坐标映射为 stage 坐标
provide('canvasWrapRef', wrap)

const sizeStore = useSizeStore()
const { width, height, scale } = storeToRefs(sizeStore)

// V1.5: 使用新的树形 Store
const compStore = useComponentStore()
const { currentTree, isDragging, selectedId } = storeToRefs(compStore)
const { addComponent, setSelected, clearSelection, setDragging } = compStore

// 处理点击选中
const handleCanvasClick = (e: MouseEvent) => {
  e.stopPropagation()
  const target = e.target as HTMLElement

  // 通过 data-id 属性找到点击的组件
  const nodeEl = target.closest('[data-id]')
  if (nodeEl) {
    const id = nodeEl.getAttribute('data-id')
    if (id) {
      setSelected(id)
      return
    }
  }

  // 点击空白取消选中
  clearSelection()
}

// 处理拖拽放置
const handleDrop = (e: DragEvent) => {
  e.preventDefault()

  try {
    const dataStr = e.dataTransfer?.getData('application/x-component') || '{}'
    const data = JSON.parse(dataStr)

    if (!data.componentName) {
      console.warn('[CanvasBoard] Invalid drop data:', data)
      return
    }

    // 计算放置位置
    const el = wrap.value
    if (!el) return

    const rect = el.getBoundingClientRect()
    const scaleValue = scale.value || 1

    // 转换为 stage 坐标
    const stageX = (e.clientX - rect.left - panX.value) / scaleValue
    const stageY = (e.clientY - rect.top - panY.value) / scaleValue

    // TODO: 可以优化，计算落点是在哪个组件内部 (TargetId)
    // 目前 V1.5 简单处理：直接添加到根节点
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

    // 选中新添加的组件
    if (newId) {
      setSelected(newId)
    }
  } catch (err) {
    console.error('[CanvasBoard] Drop error:', err)
  }

  setDragging(false)
}

const {
  menuState,
  openContextMenu,
  hideContextMenu,
  onMenuAction,
  handleGlobalClick,
  onCanvasContextMenu,
} = useContextMenu(wrap)

onMounted(() => {
  window.addEventListener('mousedown', handleGlobalClick)
  window.addEventListener('scroll', hideContextMenu, true)
})

onBeforeUnmount(() => {
  window.removeEventListener('mousedown', handleGlobalClick)
  window.removeEventListener('scroll', hideContextMenu, true)
})

// 获取画布配置
const { canvasConfig } = storeToRefs(sizeStore)

// stage层大小与网格变量
const stageStyle = computed(() => {
  const config = canvasConfig.value
  const baseStyle: Record<string, string> = {
    width: width.value + 'px',
    height: height.value + 'px',
    backgroundColor: config.backgroundColor,
  }

  // 背景图片
  if (config.backgroundImage) {
    baseStyle.backgroundImage = `url(${config.backgroundImage})`
    baseStyle.backgroundSize = 'cover'
    baseStyle.backgroundPosition = 'center'
    baseStyle.backgroundRepeat = 'no-repeat'
  }

  // 网格显示
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

// 平移 + 缩放
const { panX, panY, isPanning } = useCanvasInteraction(wrap, scale, {
  enablePan: true,
  enableZoom: true,
  enableDrop: true,
  onDrop: () => {
    // V1.5: 使用 handleDrop 处理
  },
})

// 向子组件提供画布平移量，用于组件拖拽时坐标转换
provide('canvasPanX', panX)
provide('canvasPanY', panY)

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
