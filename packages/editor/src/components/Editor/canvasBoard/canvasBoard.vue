<template>
  <div
    class="canvas-wrap"
    ref="wrap"
    :class="{ dragging: isPanning }"
    data-testid="canvas-board"
    @dragover.prevent
    @contextmenu.prevent="onCanvasContextMenu"
    @click="handleCanvasClick"
  >
    <div class="world" :style="worldStyle">
      <div class="stage" :style="stageStyle">
        <!-- 缩放平移容器 - 只渲染顶层组件(无父组件的组件) -->
        <Shape
          v-for="com in topLevelComponents"
          :key="com.id"
          v-bind="com"
          :id="com.id"
          @open-context-menu="openContextMenu"
        >
          <component
            :is="getComponent(com.type)"
            :id="com.id"
            :style="{
              width: '100%',
              height: '100%',
            }"
          />
        </Shape>
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
import { ref, computed, provide } from 'vue'
import type { ComponentPayload } from '@lowcode/core/types/components'
import { useSizeStore } from '@/stores/size'
import { storeToRefs } from 'pinia'
import { useComponent } from '@/stores/component'
import { getComponent } from '@lowcode/materials/registry'
import { useCanvasInteraction } from '@/components/Editor/canvasBoard/canvasBoard'
import { useContextMenu } from '@/components/Editor/contextMenu/contextMenu'
import { useDataBindingEngine } from '@/runtime/useDataBindingEngine'
import { VIEWPORT_PADDING, VIEWPORT_CULLING_THRESHOLD } from '@lowcode/core/constants/editor'
import Shape from '../shape/shape.vue'
import Snap from '../snap/snap.vue'
import ContextMenu from '../contextMenu/contextMenu.vue'
import { onMounted, onBeforeUnmount } from 'vue'
const wrap = ref<HTMLDivElement | null>(null)

// 向子组件提供画布容器，用于将屏幕坐标映射为 stage 坐标
provide('canvasWrapRef', wrap)
const sizeStore = useSizeStore()
const { width, height, scale } = storeToRefs(sizeStore)

// 组件存储数组
const compStore = useComponent()
const { componentStore, isDragging } = storeToRefs(compStore)
const { addComponent, selectedId, clearSelection } = compStore

// 只渲染顶层组件(无父组件的组件)
// 注意：当前设计中子组件使用绝对坐标，拖动 Group 时会同步移动子组件的绝对坐标
// 因此所有组件都需要渲染，包括有 groupId 的子组件
// 性能优化：只渲染视口内的组件（增加边距以避免边界闪烁）
const topLevelComponents = computed(() => {
  // 对于小数量组件，直接返回所有组件
  if (componentStore.value.length <= VIEWPORT_CULLING_THRESHOLD) {
    return componentStore.value
  }

  // 大数量组件时，进行视口裁剪
  const el = wrap.value
  if (!el) return componentStore.value

  const rect = el.getBoundingClientRect()
  const scaleValue = scale.value || 1

  // 计算视口在 stage 坐标系中的范围
  const viewLeft = (-panX.value - VIEWPORT_PADDING) / scaleValue
  const viewTop = (-panY.value - VIEWPORT_PADDING) / scaleValue
  const viewRight = (rect.width - panX.value + VIEWPORT_PADDING) / scaleValue
  const viewBottom = (rect.height - panY.value + VIEWPORT_PADDING) / scaleValue

  // 过滤出视口内的组件
  return componentStore.value.filter((com) => {
    const { x, y } = com.position
    const { width, height } = com.size
    // AABB 碰撞检测
    return !(x + width < viewLeft || x > viewRight || y + height < viewTop || y > viewBottom)
  })
})

// 点击画布空白处清空选择
const handleCanvasClick = (e: MouseEvent) => {
  // 如果点击的不是shape组件：尝试命中 Group 空白区域，否则清空选择
  if (!(e.target as HTMLElement).closest('.shape-wrapper')) {
    const el = wrap.value
    if (!el) return
    const rect = el.getBoundingClientRect()
    // 计算鼠标在 stage 坐标中的位置
    const stageX = (e.clientX - rect.left - panX.value) / (scale.value || 1)
    const stageY = (e.clientY - rect.top - panY.value) / (scale.value || 1)

    // 命中测试：找到包含该点的 Group（取 zindex 最大者）
    const groups = componentStore.value
      .filter((c) => c.type === 'Group')
      .filter(
        (g) =>
          stageX >= g.position.x &&
          stageX <= g.position.x + g.size.width &&
          stageY >= g.position.y &&
          stageY <= g.position.y + g.size.height,
      )
      .sort((a, b) => a.zindex - b.zindex)
    const hit = groups[groups.length - 1]
    if (hit) {
      selectedId(hit.id)
    } else {
      clearSelection()
    }
  }
}

const {
  menuState,
  openContextMenu,
  hideContextMenu,
  onMenuAction,
  handleGlobalClick,
  onCanvasContextMenu,
} = useContextMenu(wrap)

// 数据联动引擎（编辑模式下也启用，方便实时预览效果）
const bindingEngine = useDataBindingEngine(componentStore)

onMounted(() => {
  window.addEventListener('mousedown', handleGlobalClick)
  window.addEventListener('scroll', hideContextMenu, true)
  // 启动数据联动引擎
  bindingEngine.start()
})
onBeforeUnmount(() => {
  window.removeEventListener('mousedown', handleGlobalClick)
  window.removeEventListener('scroll', hideContextMenu, true)
  // 停止数据联动引擎
  bindingEngine.stop()
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
    // 隐藏网格
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
  onDrop: (item: ComponentPayload, position) => {
    // 1. 兼容性处理：获取组件类型（优先使用 componentName）
    const componentType = item.componentName || item.type

    // 2. 校验
    if (!componentType || typeof componentType !== 'string') {
      console.warn('Invalid drop payload', item)
      return
    }

    // 3. 默认尺寸处理
    const width = typeof item.width === 'number' ? item.width : 100
    const height = typeof item.height === 'number' ? item.height : 100

    // 4. 添加组件（关键：透传 props 和 style）
    addComponent({
      type: componentType, // 使用兼容后的类型
      position,
      size: { width, height },
      props: item.props || {}, // 必须透传 props
      style: item.style || {}, // 透传样式配置
      rotation: 0,
    })
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
  /* 性能优化：启用 GPU 加速 */
  transform: translateZ(0);
}
.canvas-wrap.dragging {
  cursor: grabbing;
}

.world {
  will-change: transform;
  transform-origin: 0 0;
  /* 性能优化：启用合成层，减少重绘 */
  contain: layout style;
}

/* 拖拽时禁用子元素事件，提升性能 */
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
  /* 性能优化：限制布局计算范围 */
  contain: layout style paint;
}
</style>
