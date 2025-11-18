<template>
  <div
    class="canvas-wrap"
    ref="wrap"
    :class="{ dragging: isPanning }"
    @dragover.prevent
    @drop="onDrop"
    @contextmenu.prevent="onCanvasContextMenu"
  >
    <div class="world" :style="worldStyle">
      <div class="stage" :style="stageStyle">
        <!-- 缩放平移容器 -->
        <Shape
          v-for="com in componentStore"
          :key="com.id"
          v-bind="com"
          @click.stop="selectedId(com.id)"
          :id="com.id"
          @open-context-menu="openContextMenu"
        >
          <component
            :is="getComponent(com.type)"
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
import { useCanvasInteraction } from '@/components/Editor/canvasBoard'
import { useContextMenu } from '@/components/Editor/contextMenu'
import Shape from './shape.vue'
import Snap from './snap.vue'
import ContextMenu from './ContextMenu.vue'
import { onMounted, onBeforeUnmount } from 'vue'
const wrap = ref<HTMLDivElement | null>(null)

// 向子组件提供画布容器，用于将屏幕坐标映射为 stage 坐标
provide('canvasWrapRef', wrap)
const sizeStore = useSizeStore()
const { width, height, scale } = storeToRefs(sizeStore)



// 组件存储数组
const compStore = useComponent()
const { componentStore, isDragging } = storeToRefs(compStore)
const { addComponent, selectedId } = compStore

const {
  menuState,
  openContextMenu,
  hideContextMenu,
  onMenuAction,
  handleGlobalClick,
  onCanvasContextMenu
} =
  useContextMenu(wrap)

onMounted(() => {
  window.addEventListener('mousedown', handleGlobalClick)
  window.addEventListener('scroll', hideContextMenu, true)
})
onBeforeUnmount(() => {
  window.removeEventListener('mousedown', handleGlobalClick)
  window.removeEventListener('scroll', hideContextMenu, true)
})

// 添加组件
function onDrop(e: DragEvent) {
  e.preventDefault()
  const data = e.dataTransfer?.getData('application/x-component')
  if (!data) return
  try {
    console.log(componentStore)

    const item = JSON.parse(data)
    const el = wrap.value
    if (!el) return
    const rect = el.getBoundingClientRect()
    // 计算相对于stage的位置
    const x = (e.clientX - rect.left - panX.value) / scale.value
    const y = (e.clientY - rect.top - panY.value) / scale.value
    // 添加组件
    console.log(item)
    addComponent({
      type: item.type,
      position: { x, y },
      size: { width: item.width, height: item.height },
      rotation: '0deg',
    })
  } catch (error) {
    console.error('Drop error:', error)
  }
}



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
