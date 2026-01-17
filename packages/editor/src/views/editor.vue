<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useSizeStore } from '@/stores/size'
import { useProjectStore } from '@/stores/project'
import { useComponent } from '@/stores/component'
import headerNav from '@/components/Layout/Header/Header.vue'
import SiderBar from '../components/siderBar/siderBar.vue'
import componentBar from '../components/componentBar/componentBar.vue'
import CanvasBoard from '../components/Editor/canvasBoard/canvasBoard.vue'
import RuntimeRenderer from '@/runtime/RuntimeRenderer.vue'
import AIAssistDialog from '@/components/AIAssist/AIAssistDialog.vue'
import { provideComponentEvents } from '@/components/siderBar/events/events'
import { ElMessage } from 'element-plus'
import { Loading, View, Edit, InfoFilled } from '@element-plus/icons-vue'
import * as projectService from '@/services/projects'

// 初始化事件系统
provideComponentEvents()

// 路由相关
const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()
const { componentStore } = storeToRefs(useComponent())

// 加载状态
const isLoading = ref(true)

// 获取画布缩放状态
const sizeStore = useSizeStore()
const { scale } = storeToRefs(sizeStore)
const zoomPercentage = computed(() => Math.round((scale.value || 1) * 100))

// 侧边栏宽度状态
const leftSidebarWidth = ref(300)
const rightSidebarWidth = ref(340)

// AI 助手状态
const aiVisible = ref(false)

// 模拟运行模式开关
const isSimulationMode = ref(false)

// 拖拽调整宽度的状态
const isResizingLeft = ref(false)
const isResizingRight = ref(false)

// 加载项目数据
onMounted(async () => {
  const projectId = route.params.id as string
  if (!projectId) {
    ElMessage.error('项目ID无效')
    router.push('/')
    return
  }

  isLoading.value = true

  try {
    // 先尝试从后端获取项目数据
    const serverProject = await projectService.getProject(projectId)

    if (serverProject) {
      // 查找或创建本地项目
      let localProject = projectStore.projectList.find((p) => p.id === projectId)

      if (!localProject) {
        // 本地没有，从服务器数据创建
        localProject = {
          id: projectId,
          name: serverProject.name,
          description: serverProject.description,
          cover: serverProject.cover,
          createdAt: new Date(serverProject.createdAt).getTime(),
          updatedAt: new Date(serverProject.updatedAt).getTime(),
          pages: serverProject.pages || [],
        }
        projectStore.projectList.push(localProject)
      } else {
        // 本地有，比较更新时间，避免用旧服务器数据覆盖本地最新更改
        const serverUpdatedAt = new Date(serverProject.updatedAt).getTime()
        if (localProject.updatedAt >= serverUpdatedAt) {
          // 本地数据更新，保留本地数据
          console.log('本地数据更新，保留本地更改')
        } else {
          // 服务器数据更新，同步到本地
          localProject.pages = serverProject.pages || localProject.pages
          localProject.updatedAt = serverUpdatedAt
        }
      }
    }

    // 加载项目到编辑器
    projectStore.loadProject(projectId)
  } catch (error) {
    console.warn('从服务器加载失败，尝试本地加载:', error)

    // 降级到本地加载
    if (!projectStore.loadProject(projectId)) {
      ElMessage.error('项目不存在')
      router.push('/')
      return
    }
  } finally {
    isLoading.value = false
  }
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

  <!-- 加载状态 -->
  <div v-else-if="isLoading" class="loading-container">
    <el-icon class="loading-icon" :size="48"><Loading /></el-icon>
    <p class="loading-text">正在加载项目...</p>
  </div>

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
        <!-- 模拟运行开关 -->
        <div class="simulation-toolbar">
          <el-switch
            v-model="isSimulationMode"
            active-text="模拟运行"
            inactive-text="编辑模式"
            :active-icon="View"
            :inactive-icon="Edit"
            size="default"
          />
          <el-tooltip
            content="在编辑模式下可以选择和编辑组件，在模拟运行模式下可以测试交互效果"
            placement="bottom"
          >
            <el-icon class="info-icon"><InfoFilled /></el-icon>
          </el-tooltip>
        </div>

        <CanvasBoard v-if="!isSimulationMode" />

        <!-- 模拟运行模式 -->
        <RuntimeRenderer
          v-else
          :components="componentStore"
          :pages="[]"
          :is-project-mode="false"
          mode="simulation"
        />

        <div class="zoom-indicator">
          <span class="zoom-label">缩放:</span>
          <span class="zoom-value">{{ zoomPercentage }}%</span>
        </div>
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
  gap: 12px; /* 顶部栏和主体之间的间距 */
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
  min-height: 0; /* 关键：允许 Flex 子项在高度上收缩 */
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

/* 缩放比率显示 */
.zoom-indicator {
  position: absolute;
  bottom: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  box-shadow: var(--el-box-shadow-light);
  font-size: 13px;
  color: var(--el-text-color-regular);
  pointer-events: none;
  z-index: 100;
}

.zoom-label {
  color: var(--el-text-color-secondary);
  font-weight: 500;
}

.zoom-value {
  font-weight: 600;
  color: var(--el-color-primary);
  font-variant-numeric: tabular-nums;
  min-width: 40px;
  text-align: right;
}

/* 加载状态样式 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: var(--bg-app, #f5f7fa);
  gap: 16px;
}

.loading-icon {
  color: var(--el-color-primary);
  animation: rotating 1.5s linear infinite;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin: 0;
}

/* 模拟运行工具栏 */
.simulation-toolbar {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  box-shadow: var(--el-box-shadow);
  z-index: 200;
}

.simulation-toolbar .info-icon {
  color: var(--el-color-info);
  cursor: help;
  font-size: 16px;
}
</style>
