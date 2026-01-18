<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUIStore } from '@/stores/ui'
import { useProjectStore } from '@/stores/project'
import { useComponent } from '@/stores/component'
import EditorLayout from '@/components/Layout/EditorLayout.vue'
import Header from '@/components/Layout/Header/Header.vue'
import SidePanel from '@/components/Layout/Panel/SidePanel.vue'
import StatusBar from '@/components/Layout/StatusBar/StatusBar.vue'
import MaterialPanel from '@/components/MaterialPanel/MaterialPanel.vue'
import CanvasBoard from '@/components/Canvas/CanvasBoard.vue'
import SetterPanel from '@/components/SetterPanel/SetterPanel.vue'
import AIAssistDialog from '@/components/AIAssist/AIAssistDialog.vue'
import { provideComponentEvents } from '@/composables/useComponentEvents'
import { ElMessage } from 'element-plus'
import { Loading, View, Edit, InfoFilled } from '@element-plus/icons-vue'
import * as projectService from '@/services/projects'
import { RuntimeRenderer } from '@vela/renderer'

// 初始化事件系统（TODO: 重构event系统后恢复）
// provideComponentEvents()

// 路由相关
const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()
const compStore = useComponent()
const { rootNode } = storeToRefs(compStore)

// 加载状态
const isLoading = ref(true)

// 获取画布缩放状态
const uiStore = useUIStore()
const { canvasScale } = storeToRefs(uiStore)
const zoomPercentage = computed(() => Math.round((canvasScale.value || 1) * 100))

// AI 助手状态
const aiVisible = ref(false)

// 模拟运行模式开关
const isSimulationMode = ref(false)

// 加载项目数据
onMounted(async () => {
  const projectId = route.params.id as string

  // 如果没有项目ID（如 /editor-v2 路由），跳过加载直接进入编辑器
  if (!projectId) {
    console.log('开发模式：无项目ID，直接进入编辑器')
    isLoading.value = false
    return
  }

  isLoading.value = true

  try {
    // 从服务器加载项目数据
    await projectService.getProject(projectId)
    // 初始化项目数据（这里需要根据实际API调整）
    ElMessage.success('项目加载成功')
  } catch (error) {
    console.warn('从服务器加载失败:', error)
    ElMessage.error('项目加载失败')
    router.push('/')
  } finally {
    isLoading.value = false
  }
})

// 打开 AI 助手
function handleOpenAIAssist() {
  aiVisible.value = true
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

  <EditorLayout v-else>
    <template #header>
      <Header @open-ai-assist="handleOpenAIAssist" />
    </template>

    <template #left>
      <SidePanel title="组件库">
        <MaterialPanel />
      </SidePanel>
    </template>

    <template #center>
      <div class="canvas-wrapper">
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

        <!-- 画布区域 -->
        <CanvasBoard v-if="!isSimulationMode" />

        <!-- 模拟运行模式 -->
        <RuntimeRenderer
          v-else
          :components="rootNode ? [rootNode] : []"
          :pages="[]"
          :is-project-mode="false"
          mode="simulation"
        />

        <!-- 缩放指示器 -->
        <div class="zoom-indicator">
          <span class="zoom-label">缩放:</span>
          <span class="zoom-value">{{ zoomPercentage }}%</span>
        </div>
      </div>
    </template>

    <template #right>
      <SidePanel title="属性设置">
        <SetterPanel />
      </SidePanel>
    </template>

    <template #footer>
      <StatusBar />
    </template>
  </EditorLayout>

  <AIAssistDialog v-model:visible="aiVisible" />
</template>

<style scoped>
/* 加载状态样式 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: var(--el-fill-color-lighter);
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

/* 画布包装器 */
.canvas-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
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

/* 缩放指示器 */
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
</style>
