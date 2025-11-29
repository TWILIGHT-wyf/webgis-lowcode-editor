<script setup lang="ts">
import { ref, onMounted } from 'vue'
import headerNav from './components/header.vue'
import SiderBar from './components/siderBar/siderBar.vue'
import componentBar from './components/componentBar.vue'
import CanvasBoard from './components/Editor/canvasBoard/canvasBoard.vue'
import AIAssistDialog from '@/components/AIAssistDialog.vue'
import { provideComponentEvents } from '@/components/siderBar/events/events'

// 侧边栏宽度状态
const leftSidebarWidth = ref(300)
const rightSidebarWidth = ref(340)

// AI 助手状态
const aiVisible = ref(false)

// 拖拽调整宽度的状态
const isResizingLeft = ref(false)
const isResizingRight = ref(false)

// 初始化事件系统
onMounted(() => {
  provideComponentEvents()
})

// 打开 AI 助手
function handleOpenAIAssist() {
  aiVisible.value = true
}

// 左侧拖拽逻辑
function startResizeLeft(e: MouseEvent) {
  isResizingLeft.value = true
  const startX = e.clientX
  const startWidth = leftSidebarWidth.value

  const onMouseMove = (ev: MouseEvent) => {
    if (!isResizingLeft.value) return
    const newWidth = startWidth + (ev.clientX - startX)
    if (newWidth >= 200 && newWidth <= 600) leftSidebarWidth.value = newWidth
  }

  const onMouseUp = () => {
    isResizingLeft.value = false
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

// 右侧拖拽逻辑
function startResizeRight(e: MouseEvent) {
  isResizingRight.value = true
  const startX = e.clientX
  const startWidth = rightSidebarWidth.value

  const onMouseMove = (ev: MouseEvent) => {
    if (!isResizingRight.value) return
    const newWidth = startWidth + (startX - ev.clientX)
    if (newWidth >= 240 && newWidth <= 600) rightSidebarWidth.value = newWidth
  }

  const onMouseUp = () => {
    isResizingRight.value = false
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}
</script>

<template>
  <router-view v-if="$route.path === '/runtime'" v-slot="{ Component }">
    <component :is="Component" v-if="Component" />
  </router-view>

  <div v-else class="app-layout">

    <header class="header-card">
      <headerNav @open-ai-assist="handleOpenAIAssist" />
    </header>

    <div class="main-content">

      <aside class="floating-card sidebar-card" :style="{ width: leftSidebarWidth + 'px' }">
        <componentBar />
      </aside>

      <div class="resize-handle" @mousedown="startResizeLeft"></div>

      <main class="floating-card canvas-card">
        <CanvasBoard />
      </main>

      <div class="resize-handle" @mousedown="startResizeRight"></div>

      <aside class="floating-card sidebar-card" :style="{ width: rightSidebarWidth + 'px' }">
        <SiderBar />
      </aside>

    </div>

    <AIAssistDialog v-model:visible="aiVisible" />
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--bg-app); /* 使用主题定义的应用底色 */
  padding: 12px; /* 给整个页面四周留出空隙 */
  box-sizing: border-box;
  gap: 12px;     /* 顶部栏和主体之间的间距 */
  overflow: hidden;
}

/* 顶部导航卡片 */
.header-card {
  height: 56px;
  flex-shrink: 0;
  background-color: var(--bg-card);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  z-index: 10;
}

/* 主体内容区 (横向 Flex) */
.main-content {
  flex: 1;
  display: flex;
  overflow: hidden; /* 防止内容溢出 */
  min-height: 0;    /* 关键：允许 Flex 子项在高度上收缩 */
}

/* 通用悬浮卡片样式 */
.floating-card {
  background-color: var(--bg-card);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.sidebar-card {
  flex-shrink: 0;
  transition: width 0.05s linear; /* 拖拽时更跟手 */
}

.canvas-card {
  flex: 1;
  margin: 0; /* 无需 margin，由 main-content 的 gap 或 resize-handle 占位 */
  position: relative;
  /* 画布背景在 CanvasBoard 内部设置，这里只需作为容器 */
}

/* 拖拽条样式 */
.resize-handle {
  width: 12px; /* 实际上占据 12px 的空间作为视觉间距 */
  cursor: col-resize;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  /* 透明背景，模拟 gap */
}

/* 拖拽条中间的小竖线 (Hover 时显示，增强交互感) */
.resize-handle::after {
  content: '';
  width: 4px;
  height: 32px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  opacity: 0;
  transition: opacity 0.2s;
}

.resize-handle:hover::after {
  opacity: 1;
}
</style>
