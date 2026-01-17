<template>
  <header class="vela-header">
    <div class="left-section">
      <!-- 品牌区 -->
      <el-tooltip content="返回项目列表" placement="bottom">
        <div class="brand" @click="goHome">
          <el-icon class="brand-icon" :size="20"><MapLocation /></el-icon>
          <span class="brand-text">Vela Engine</span>
        </div>
      </el-tooltip>

      <el-divider direction="vertical" class="header-divider" />

      <!-- 页面导航器 -->
      <PageNavigator />

      <el-divider direction="vertical" class="header-divider" />

      <!-- 历史记录控制 -->
      <div class="history-controls">
        <el-tooltip content="撤销 (Ctrl+Z)" placement="bottom">
          <el-button text circle @click="undo" :disabled="!canUndo">
            <el-icon><Back /></el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="重做 (Ctrl+Y)" placement="bottom">
          <el-button text circle @click="redo" :disabled="!canRedo">
            <el-icon><Right /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </div>

    <div class="right-section">
      <!-- 保存状态指示器 -->
      <SaveStatusIndicator />

      <el-divider direction="vertical" class="header-divider" />

      <!-- 操作按钮组 -->
      <div class="action-group">
        <el-tooltip content="保存项目到服务器" placement="bottom">
          <el-button text circle @click="saveProject" :loading="saving">
            <el-icon><Finished /></el-icon>
          </el-button>
        </el-tooltip>

        <el-tooltip content="导出源码" placement="bottom">
          <el-button circle type="primary" plain class="export-btn" @click="openExportDialog">
            <el-icon><Download /></el-icon>
          </el-button>
        </el-tooltip>

        <el-tooltip content="导出 JSON 文件" placement="bottom">
          <el-button text circle @click="exportJSON">
            <el-icon><Document /></el-icon>
          </el-button>
        </el-tooltip>

        <el-tooltip content="清空当前页面" placement="bottom">
          <el-button text circle type="danger" @click="handleReset">
            <el-icon><Delete /></el-icon>
          </el-button>
        </el-tooltip>
      </div>

      <el-divider direction="vertical" class="header-divider" />

      <!-- 预览下拉菜单 -->
      <el-dropdown split-button type="default" @click="openPreview('page')" @command="handlePreviewCommand">
        <el-icon class="icon-left"><View /></el-icon>
        预览
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="page" icon="Document">预览当前页面</el-dropdown-item>
            <el-dropdown-item command="project" icon="Files">预览整个项目</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- AI 助手 -->
      <el-button type="primary" round @click="openAIAssist" class="ai-btn">
        <el-icon class="icon-left"><MagicStick /></el-icon>
        AI 助手
        <el-badge v-if="pendingCount > 0" :value="pendingCount" is-dot class="ai-badge" />
      </el-button>

      <el-divider direction="vertical" class="header-divider" />

      <!-- 主题切换 -->
      <el-switch
        v-model="isDark"
        inline-prompt
        :active-icon="Moon"
        :inactive-icon="Sunny"
        style="margin-left: 4px"
      />
    </div>

    <!-- 导出配置对话框 -->
    <ExportConfigDialog
      v-model="exportDialogVisible"
      :project="projectStore.currentProject || null"
    />
  </header>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useComponent } from '@/stores/component'
import { useProjectStore } from '@/stores/project'
import { useSuggestion } from '@/stores/suggestion'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as projectService from '@/services/projects'
import PageNavigator from './PageNavigator.vue'
import SaveStatusIndicator from '@/components/header/SaveStatusIndicator.vue'
import ExportConfigDialog from '@/components/dialogs/ExportConfigDialog.vue'
import {
  Back,
  Right,
  View,
  MagicStick,
  Finished,
  Download,
  Document,
  Delete,
  Moon,
  Sunny,
  MapLocation,
} from '@element-plus/icons-vue'

const router = useRouter()
const compStore = useComponent()
const projectStore = useProjectStore()
const suggestionStore = useSuggestion()

const { reset, undo, redo, canUndo, canRedo } = compStore

// 计算属性
const canUndoValue = computed(() => canUndo())
const canRedoValue = computed(() => canRedo())
const pendingCount = computed(() => suggestionStore.pendingSuggestions.length)

// 状态
const saving = ref(false)
const exportDialogVisible = ref(false)
const isDark = ref(false)

// 返回首页
function goHome() {
  if (projectStore.currentProjectId) {
    projectStore.saveCurrentPageSnapshot()
  }
  router.push('/')
}

// 保存项目
async function saveProject() {
  if (!projectStore.currentProjectId) {
    ElMessage.warning('请先创建或加载项目')
    return
  }

  saving.value = true
  try {
    projectStore.saveCurrentPageSnapshot()
    await projectService.updateProject(projectStore.currentProjectId, {
      name: projectStore.currentProject!.name,
      description: projectStore.currentProject!.description,
      pages: projectStore.currentProject!.pages,
    })
    ElMessage.success('项目已保存到服务器')
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败，请检查服务器连接')
  } finally {
    saving.value = false
  }
}

// 打开导出对话框
function openExportDialog() {
  if (!projectStore.currentProject) {
    ElMessage.warning('请先创建或加载项目')
    return
  }
  projectStore.saveCurrentPageSnapshot()
  exportDialogVisible.value = true
}

// 导出 JSON
function exportJSON() {
  if (!projectStore.currentProject) {
    ElMessage.warning('没有可导出的项目')
    return
  }

  projectStore.saveCurrentPageSnapshot()
  const json = JSON.stringify(projectStore.currentProject, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${projectStore.currentProject.name || 'project'}_${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('项目已导出为 JSON 文件')
}

// 清空画布
async function handleReset() {
  try {
    await ElMessageBox.confirm('确定清空当前页面的所有组件吗？此操作不可恢复', '警告', {
      type: 'warning',
      confirmButtonText: '清空',
      cancelButtonText: '取消',
    })
    reset()
    ElMessage.success('画布已清空')
  } catch {
    // 用户取消
  }
}

// 预览
function openPreview(mode: 'page' | 'project' = 'page') {
  if (!projectStore.currentProjectId) {
    ElMessage.warning('请先创建项目')
    return
  }

  projectStore.saveCurrentPageSnapshot()

  if (mode === 'project') {
    router.push(`/runtime?projectId=${projectStore.currentProjectId}&mode=project`)
  } else {
    router.push(
      `/runtime?projectId=${projectStore.currentProjectId}&pageId=${projectStore.activePageId}`,
    )
  }
}

function handlePreviewCommand(command: string) {
  openPreview(command as 'page' | 'project')
}

// AI 助手
const emit = defineEmits(['open-ai-assist'])
function openAIAssist() {
  emit('open-ai-assist')
}

// 主题切换
watch(isDark, (val) => {
  localStorage.setItem('theme', val ? 'dark' : 'light')
  document.body.classList.toggle('theme-dark', val)
})

onMounted(() => {
  isDark.value = localStorage.getItem('theme') === 'dark'
  if (isDark.value) {
    document.body.classList.add('theme-dark')
  }
})
</script>

<style scoped>
.vela-header {
  height: 48px;
  border-bottom: 1px solid var(--el-border-color);
  background: var(--el-bg-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  box-sizing: border-box;
}

.left-section,
.right-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 品牌样式 */
.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 18px;
  color: var(--el-text-color-primary);
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 8px;
  transition: all 0.2s;
  letter-spacing: -0.5px;
}

.brand:hover {
  background-color: rgba(66, 133, 244, 0.08);
  color: var(--el-color-primary);
}

.brand-icon {
  font-size: 20px;
  color: var(--el-color-primary);
}

.brand-text {
  font-weight: 700;
}

/* 分隔线 */
.header-divider {
  height: 16px;
  margin: 0 4px;
}

/* 历史记录控制 */
.history-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 操作按钮组 */
.action-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.export-btn {
  box-shadow: 0 0 8px rgba(66, 133, 244, 0.25);
}

/* AI 按钮 */
.ai-btn {
  position: relative;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  font-weight: 500;
}

.ai-btn:hover {
  opacity: 0.9;
}

.ai-badge {
  position: absolute;
  top: -2px;
  right: -2px;
}

.icon-left {
  margin-right: 4px;
}
</style>
