<template>
  <div class="header-container">
    <!-- 左侧区域 -->
    <div class="left-section">
      <!-- 1. Logo - 点击返回 Dashboard -->
      <el-tooltip content="返回项目列表" placement="bottom">
        <div class="brand" @click="goToDashboard">
          <el-icon class="brand-icon"><MapLocation /></el-icon>
          <span class="logo-text">WebGIS Studio</span>
        </div>
      </el-tooltip>

      <div class="divider"></div>

      <!-- 2. 新增：页面管理 (垂直下拉 Mega Dropdown) -->
      <div class="page-manager-wrapper" ref="managerRef">
        <el-button
          class="page-trigger-btn"
          :class="{ 'is-active': isPageMenuOpen }"
          text
          @click="togglePageMenu"
        >
          <el-icon class="icon-left"><Files /></el-icon>
          <div class="current-page-info">
            <span class="page-name">{{ activePage?.name || '选择页面' }}</span>
          </div>
          <el-icon class="icon-right" :class="{ 'rotate-180': isPageMenuOpen }"
            ><ArrowDown
          /></el-icon>
        </el-button>

        <!-- 下拉面板 -->
        <transition name="el-zoom-in-top">
          <div v-if="isPageMenuOpen" class="mega-dropdown">
            <!-- 搜索栏 -->
            <div class="dropdown-header">
              <el-input
                v-model="searchQuery"
                placeholder="搜索页面或路由..."
                prefix-icon="Search"
                size="small"
                clearable
              />
            </div>

            <!-- 页面树 -->
            <div class="dropdown-body">
              <el-scrollbar max-height="300px">
                <div class="tree-container">
                  <TreeNode
                    v-for="node in filteredTree"
                    :key="node.id"
                    :node="node"
                    :active-id="activePageId"
                    @select="selectPage"
                    @delete="handleDeletePage"
                    @edit="handleEditPage"
                    @copy-route="handleCopyRoute"
                  />
                </div>
              </el-scrollbar>
            </div>

            <!-- 底部操作栏 -->
            <div class="dropdown-footer">
              <el-button
                size="small"
                icon="DocumentAdd"
                type="primary"
                @click="handleAddPage"
                style="width: 100%"
              >
                新建页面
              </el-button>
            </div>
          </div>
        </transition>
      </div>

      <div class="divider"></div>

      <!-- 3. 原有的历史记录控制 -->
      <div class="history-controls">
        <el-tooltip content="撤销 (Ctrl+Z)" placement="bottom">
          <el-button text circle @click="undo" :disabled="!canUndoRef">
            <el-icon><Back /></el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="重做 (Ctrl+Y)" placement="bottom">
          <el-button text circle @click="redo" :disabled="!canRedoRef">
            <el-icon><Right /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </div>

    <!-- 右侧区域 -->
    <div class="right-section">
      <!-- 保存状态指示器 -->
      <SaveStatusIndicator />

      <div class="divider"></div>

      <div class="action-group">
        <el-tooltip content="保存项目到服务器" placement="bottom">
          <el-button text circle @click="saveProject" :loading="saving">
            <el-icon><Finished /></el-icon>
          </el-button>
        </el-tooltip>

        <el-tooltip content="导出源码" placement="bottom">
          <el-button
            circle
            type="primary"
            plain
            class="export-entry-button"
            @click="openExportDialog"
          >
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

      <div class="divider"></div>

      <el-dropdown
        split-button
        type="default"
        @click="openPreview('page')"
        @command="handlePreviewCommand"
      >
        <el-icon class="icon-left"><View /></el-icon>
        预览
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="page" icon="Document">预览当前页面</el-dropdown-item>
            <el-dropdown-item command="project" icon="Files">预览整个项目</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-button type="primary" round @click="openAIAssist" class="ai-btn">
        <el-icon class="icon-left"><MagicStick /></el-icon>
        AI 助手
        <el-badge v-if="pendingCount > 0" :value="pendingCount" is-dot class="ai-badge" />
      </el-button>

      <div class="divider"></div>

      <el-switch
        v-model="isDark"
        inline-prompt
        :active-icon="Moon"
        :inactive-icon="Sunny"
        style="margin-left: 4px"
      />
    </div>

    <!-- 新建页面对话框 -->
    <el-dialog
      v-model="showAddPageDialog"
      title="新建页面"
      width="420px"
      align-center
      class="add-page-dialog"
      :close-on-click-modal="false"
    >
      <el-form :model="newPageForm" label-position="top" class="add-page-form">
        <el-form-item label="页面名称" required>
          <el-input
            v-model="newPageForm.name"
            placeholder="例如：关于我们、联系方式"
            maxlength="30"
            show-word-limit
            size="large"
          >
            <template #prefix>
              <el-icon><DocumentAdd /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="路由路径 (可选)">
          <el-input
            v-model="newPageForm.route"
            placeholder="如：/about、/contact"
            maxlength="50"
            size="large"
          >
            <template #prefix>
              <el-icon><Link /></el-icon>
            </template>
          </el-input>
          <div class="form-tip">留空则使用页面名称自动生成路由</div>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showAddPageDialog = false" size="large">取消</el-button>
          <el-button type="primary" @click="submitAddPage" size="large" icon="Plus">
            创建页面
          </el-button>
        </div>
      </template>
    </el-dialog>

    <ExportConfigDialog
      v-model="exportDialogVisible"
      :project="projectStore.currentProject || null"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useComponent } from '@/stores/component'
import { useProjectStore } from '@/stores/project'
import { useSuggestion } from '@/stores/suggestion'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as projectService from '@/services/projects'
import type { PageTreeNode } from '@vela/core/types/page'
import TreeNode from './treeNode.vue'
import SaveStatusIndicator from './SaveStatusIndicator.vue'
import ExportConfigDialog from '@/components/dialogs/ExportConfigDialog.vue'
// 引入图标
import {
  Back,
  Right,
  View,
  MagicStick,
  Files,
  ArrowDown,
  Finished,
  Download,
  Document,
  Delete,
  Moon,
  Sunny,
  DocumentAdd,
  Link,
  MapLocation,
} from '@element-plus/icons-vue'

const router = useRouter()
const compStore = useComponent()
const projectStore = useProjectStore()
const suggestionStore = useSuggestion()

const { reset, undo, redo, canUndo, canRedo } = compStore

const canUndoRef = computed(() => canUndo())
const canRedoRef = computed(() => canRedo())
const pendingCount = computed(() => suggestionStore.pendingSuggestions.length)

// --- 页面管理逻辑 - 接入后端 Start ---
const isPageMenuOpen = ref(false)
const managerRef = ref<HTMLElement | null>(null)
const searchQuery = ref('')
const saving = ref(false)
const exportDialogVisible = ref(false)

// 从 Store 获取真实页面列表并转换为树节点
const pagesFromStore = computed(() => projectStore.currentProject?.pages || [])
const activePageId = computed(() => projectStore.activePageId || '')

const activePage = computed(() => {
  const page = pagesFromStore.value.find((p) => p.id === activePageId.value)
  return page
})

// 将页面列表转换为树节点格式
const pageTree = computed<PageTreeNode[]>(() => {
  return pagesFromStore.value.map((page, index) => ({
    id: page.id,
    name: page.name,
    type: 'page' as const,
    path: page.route || `/${page.name.toLowerCase().replace(/\s+/g, '-')}`, // 优先使用 route，否则自动生成
    expanded: false,
    isHome: index === 0, // 第一个页面标记为首页
  }))
})

const filteredTree = computed(() => {
  if (!searchQuery.value) return pageTree.value
  return pageTree.value.filter((node) =>
    node.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

function togglePageMenu() {
  isPageMenuOpen.value = !isPageMenuOpen.value
}

function selectPage(pageId: string) {
  projectStore.switchPage(pageId)
  isPageMenuOpen.value = false
}

async function handleAddPage() {
  showAddPageDialog.value = true
  newPageForm.value = { name: '', route: '' }
}

// 新建页面对话框
const showAddPageDialog = ref(false)
const newPageForm = ref({ name: '', route: '' })

async function submitAddPage() {
  const name = newPageForm.value.name?.trim()
  const route = newPageForm.value.route?.trim()

  if (!name) {
    ElMessage.warning('页面名称不能为空')
    return
  }

  projectStore.addPage(name, route)
  ElMessage.success('页面创建成功')
  showAddPageDialog.value = false
  isPageMenuOpen.value = false
}

async function handleDeletePage(pageId: string) {
  const page = pagesFromStore.value.find((p) => p.id === pageId)
  if (!page) return

  try {
    await ElMessageBox.confirm(`确定删除页面 "${page.name}" 吗？`, '警告', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })

    projectStore.removePage(pageId)
    ElMessage.success('页面已删除')
  } catch {
    // 用户取消
  }
}

async function handleEditPage(data: { id: string; name: string; route?: string }) {
  try {
    projectStore.renamePage(data.id, data.name, data.route)
    ElMessage.success('页面信息已更新')
  } catch (error) {
    console.error('编辑页面失败:', error)
    ElMessage.error('编辑页面失败，请重试')
  }
}

async function handleCopyRoute(route: string) {
  try {
    await navigator.clipboard.writeText(route)
    ElMessage.success(`路由 "${route}" 已复制到剪贴板`)
  } catch (error) {
    console.error('复制失败:', error)
    // 降级方案：使用传统方法
    try {
      const textArea = document.createElement('textarea')
      textArea.value = route
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      ElMessage.success(`路由 "${route}" 已复制到剪贴板`)
    } catch (fallbackError) {
      console.error('降级复制也失败:', fallbackError)
      ElMessage.error('复制失败，请手动复制')
    }
  }
}

// 点击外部关闭下拉菜单
function handleClickOutside(event: MouseEvent) {
  if (managerRef.value && !managerRef.value.contains(event.target as Node)) {
    isPageMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  isDark.value = localStorage.getItem('theme') === 'dark'
  applyTheme(isDark.value)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
// --- 页面管理逻辑 End ---

// 主题切换
const isDark = ref(false)
watch(isDark, (val) => {
  localStorage.setItem('theme', val ? 'dark' : 'light')
  applyTheme(val)
})
function applyTheme(dark: boolean) {
  document.body.classList.toggle('theme-dark', dark)
}

// AI 助手
const emit = defineEmits(['open-ai-assist'])
function openAIAssist() {
  emit('open-ai-assist')
}

// 返回 Dashboard
function goToDashboard() {
  // 先保存当前工作
  if (projectStore.currentProjectId) {
    projectStore.saveCurrentPageSnapshot()
  }
  router.push('/')
}

// 预览 - 支持单页面和整个项目
function openPreview(mode: 'page' | 'project' = 'page') {
  if (!projectStore.currentProjectId) {
    ElMessage.warning('请先创建项目')
    return
  }

  // 先保存当前画布快照
  projectStore.saveCurrentPageSnapshot()

  if (mode === 'project') {
    // 项目级预览 - 不传 pageId，预览整个项目（从首页开始）
    router.push(`/runtime?projectId=${projectStore.currentProjectId}&mode=project`)
  } else {
    // 单页面预览 - 传递当前正在编辑的 pageId
    router.push(`/runtime?projectId=${projectStore.currentProjectId}&pageId=${activePageId.value}`)
  }
}

// 处理预览下拉菜单命令
function handlePreviewCommand(command: string) {
  openPreview(command as 'page' | 'project')
}

const openExportDialog = () => {
  if (!projectStore.currentProject) {
    ElMessage.warning('请先创建或加载项目')
    return
  }
  projectStore.saveCurrentPageSnapshot()
  exportDialogVisible.value = true
}

// 保存到服务器
async function saveProject() {
  if (!projectStore.currentProjectId) {
    ElMessage.warning('请先创建或加载项目')
    return
  }

  saving.value = true
  try {
    // 保存当前画布快照到 Store
    projectStore.saveCurrentPageSnapshot()

    // 调用后端 API 更新
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

// 导出 JSON 文件
function exportJSON() {
  if (!projectStore.currentProject) {
    ElMessage.warning('没有可导出的项目')
    return
  }

  // 保存当前快照
  projectStore.saveCurrentPageSnapshot()

  // 生成 JSON 并下载
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

// 清空当前页面
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
</script>

<style scoped>
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 16px;
  position: relative; /* 为下拉菜单定位 */
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
  color: var(--text-primary);
  margin-right: 4px;
  letter-spacing: -0.5px;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 8px;
  transition: all 0.2s;
}

.brand:hover {
  background-color: rgba(66, 133, 244, 0.08);
  color: var(--el-color-primary);
}

.brand-icon {
  font-size: 20px;
  color: var(--el-color-primary);
}

.divider {
  width: 1px;
  height: 16px;
  background-color: var(--el-border-color); /* 使用 Element 变量 */
  margin: 0 8px;
}

/* --- 新增：页面管理器样式 --- */
.page-manager-wrapper {
  position: relative;
}

.page-trigger-btn {
  font-weight: 500;
  color: var(--el-text-color-regular);
  padding: 8px 14px;
  height: 36px;
  border-radius: 8px;
  transition: all 0.2s;
  background: transparent;
}

.page-trigger-btn:hover,
.page-trigger-btn.is-active {
  background-color: rgba(66, 133, 244, 0.08);
  color: var(--el-color-primary);
}

.current-page-info {
  display: flex;
  align-items: center;
}

.page-name {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.icon-left {
  margin-right: 6px;
}

.icon-right {
  margin-left: 6px;
  font-size: 12px;
  transition: transform 0.3s;
}

.rotate-180 {
  transform: rotate(180deg);
}

/* 垂直下拉 Mega Dropdown - 美化版 */
.mega-dropdown {
  position: absolute;
  top: 44px;
  left: 0;
  width: 320px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dropdown-header {
  padding: 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  background: linear-gradient(to bottom, var(--el-fill-color-extra-light), transparent);
}

.dropdown-header :deep(.el-input__wrapper) {
  border-radius: 8px;
  background-color: var(--el-bg-color);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.dropdown-body {
  flex: 1;
  padding: 8px 0;
  min-height: 100px;
}

.tree-container {
  padding: 0 8px;
}

.dropdown-footer {
  padding: 12px 16px;
  border-top: 1px solid var(--el-border-color-lighter);
  background: linear-gradient(to top, var(--el-fill-color-extra-light), transparent);
}

.dropdown-footer .el-button {
  border-radius: 8px;
  font-weight: 500;
}

/* --- 新建页面对话框样式 --- */
:deep(.add-page-dialog .el-dialog) {
  border-radius: 16px;
  overflow: hidden;
}

:deep(.add-page-dialog .el-dialog__header) {
  padding: 20px 24px;
  margin: 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
  background: linear-gradient(to bottom, var(--el-fill-color-extra-light), transparent);
}

:deep(.add-page-dialog .el-dialog__title) {
  font-weight: 600;
  font-size: 16px;
  color: var(--el-text-color-primary);
}

:deep(.add-page-dialog .el-dialog__body) {
  padding: 24px;
}

:deep(.add-page-dialog .el-dialog__footer) {
  padding: 16px 24px;
  border-top: 1px solid var(--el-border-color-lighter);
  background: var(--el-fill-color-extra-light);
}

.add-page-form :deep(.el-form-item__label) {
  font-weight: 500;
  color: var(--el-text-color-primary);
  padding-bottom: 8px;
}

.add-page-form :deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}

.add-page-form :deep(.el-input__wrapper:hover) {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.add-page-form :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.15);
}

.form-tip {
  margin-top: 6px;
  font-size: 12px;
  color: var(--el-text-color-placeholder);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.dialog-footer .el-button {
  border-radius: 8px;
  font-weight: 500;
  min-width: 90px;
}

/* --- 原有样式 --- */
.action-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.export-entry-button {
  box-shadow: 0 0 8px rgba(66, 133, 244, 0.25);
}

.icon-left {
  margin-right: 4px;
}

.ai-btn {
  position: relative;
  background: linear-gradient(135deg, #4285f4, #34a853);
  border: none;
}

.ai-btn:hover {
  opacity: 0.9;
}

.ai-badge {
  position: absolute;
  top: -2px;
  right: -2px;
}
</style>
