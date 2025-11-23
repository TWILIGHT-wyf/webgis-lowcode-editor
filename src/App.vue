<script setup lang="ts">
import { ref } from 'vue'
import headerNav from './components/header.vue'
import SiderBar from './components/siderBar/siderBar.vue'
import componentBar from './components/componentBar.vue'
import CanvasBoard from './components/Editor/canvasBoard/canvasBoard.vue'

// 侧边栏宽度
const leftSidebarWidth = ref(300)
const rightSidebarWidth = ref(340)
const isResizingLeft = ref(false)
const isResizingRight = ref(false)

// 左侧边栏宽度调整
function startResizeLeft(e: MouseEvent) {
  isResizingLeft.value = true
  const startX = e.clientX
  const startWidth = leftSidebarWidth.value

  const onMouseMove = (moveEvent: MouseEvent) => {
    if (!isResizingLeft.value) return
    const deltaX = moveEvent.clientX - startX
    const newWidth = startWidth + deltaX
    if (newWidth >= 250 && newWidth <= 600) {
      leftSidebarWidth.value = newWidth
    }
  }

  const onMouseUp = () => {
    isResizingLeft.value = false
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

// 右侧边栏宽度调整
function startResizeRight(e: MouseEvent) {
  isResizingRight.value = true
  const startX = e.clientX
  const startWidth = rightSidebarWidth.value

  const onMouseMove = (moveEvent: MouseEvent) => {
    if (!isResizingRight.value) return
    const deltaX = startX - moveEvent.clientX
    const newWidth = startWidth + deltaX
    if (newWidth >= 280 && newWidth <= 600) {
      rightSidebarWidth.value = newWidth
    }
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
  <div class="common-layout">
    <el-container>
      <el-header>
        <headerNav />
      </el-header>
      <el-container>
        <!-- 左侧边栏 -->
        <el-aside :width="leftSidebarWidth + 'px'">
          <componentBar />
        </el-aside>

        <!-- 左侧拖拽条 -->
        <div class="sidebar-resizer" @mousedown="startResizeLeft">
          <div class="resizer-handle"></div>
        </div>

        <!-- 中间画布 -->
        <el-main><CanvasBoard /></el-main>

        <!-- 右侧拖拽条 -->
        <div class="sidebar-resizer" @mousedown="startResizeRight">
          <div class="resizer-handle"></div>
        </div>

        <!-- 右侧边栏 -->
        <el-aside :width="rightSidebarWidth + 'px'">
          <SiderBar />
        </el-aside>
      </el-container>
    </el-container>
  </div>
</template>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
  overflow: hidden;
}
.el-container {
  height: 100%;
}
</style>

<style scoped>
.common-layout {
  height: 100vh;
}

.el-main {
  overflow: hidden;
  padding: 0;
  flex: 1;
}

.el-aside {
  overflow: hidden;
}

.sidebar-resizer {
  width: 6px;
  cursor: ew-resize;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-fill-color-light);
  position: relative;
  z-index: 10;
  transition: background 0.2s;
}

.sidebar-resizer:hover {
  background: var(--el-color-primary-light-7);
}

.resizer-handle {
  width: 2px;
  height: 60px;
  border-radius: 1px;
  background: var(--el-border-color-darker);
}

.sidebar-resizer:hover .resizer-handle {
  background: var(--el-color-primary);
  width: 3px;
}
</style>
