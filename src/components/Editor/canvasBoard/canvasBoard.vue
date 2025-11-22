<template>
  <div
    class="canvas-wrap"
    ref="wrap"
    :class="{ dragging: isPanning }"
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
import { useSizeStore } from '@/stores/size'
import { storeToRefs } from 'pinia'
import { useComponent } from '@/stores/component'
import { getComponent } from '@/customComponents/registry'
import { useCanvasInteraction } from '@/components/Editor/canvasBoard/canvasBoard'
import { useContextMenu } from '@/components/Editor/contextMenu/contextMenu'
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
const topLevelComponents = computed(() => {
  return componentStore.value.filter((c) => !c.groupId)
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

onMounted(() => {
  window.addEventListener('mousedown', handleGlobalClick)
  window.addEventListener('scroll', hideContextMenu, true)
})
onBeforeUnmount(() => {
  window.removeEventListener('mousedown', handleGlobalClick)
  window.removeEventListener('scroll', hideContextMenu, true)
})

// stage层大小与网格变量
const stageStyle = computed(() => ({
  width: width.value + 'px',
  height: height.value + 'px',
  // 网格变量
  '--grid-size': '20px',
  '--grid-major': '100px',
  '--grid-bg': '#fafafa',
  '--grid-color': '#f0f0f0',
  '--grid-major-color': '#e5e5e5',
}))

// 平移 + 缩放
const { panX, panY, isPanning } = useCanvasInteraction(wrap, scale, {
  enablePan: true,
  enableZoom: true,
  enableDrop: true,
  onDrop: (item: unknown, position) => {
    const payload = item as { type: string; width: number; height: number }
    addComponent({
      type: payload.type,
      position,
      size: { width: payload.width, height: payload.height },
      rotation: 0,
    })
  },
})

const worldStyle = computed(() => ({
  transform: `translate(${panX.value}px, ${panY.value}px) scale(${scale.value})`,
  transformOrigin: '0 0',
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
}
.canvas-wrap.dragging {
  cursor: grabbing;
}

.world {
  will-change: transform;
  transform-origin: 0 0;
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
}
</style>
