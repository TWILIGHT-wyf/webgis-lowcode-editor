<template>
  <div class="runtime-view">
    <ExportConfigDialog v-model="exportDialogVisible" :project="projectSnapshot" />

    <div v-if="isLoading" class="loading-container">
      <el-icon class="loading-icon" :size="48"><Loading /></el-icon>
      <p class="loading-text">正在加载预览...</p>
    </div>

    <template v-else>
      <div class="toolbar">
        <div class="toolbar-left">
          <el-button type="info" @click="backToEditor" icon="Back">返回编辑器</el-button>
          <div class="toolbar-info">
            <span class="project-name">{{ projectName }}</span>
            <span class="page-name" v-if="currentPageName">/ {{ currentPageName }}</span>
            <el-tag v-if="isProjectMode" type="success" size="small" class="mode-tag">
              项目预览
            </el-tag>
            <el-tag v-else type="info" size="small" class="mode-tag"> 单页预览 </el-tag>
          </div>

          <div v-if="isProjectMode && allPages.length > 1" class="page-nav">
            <el-dropdown @command="navigateToPage">
              <el-button>
                页面导航 <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="page in allPages"
                    :key="page.id"
                    :command="page.id"
                    :class="{ 'is-active': page.id === currentPageId }"
                  >
                    <el-icon v-if="page.id === currentPageId"><Check /></el-icon>
                    <span>{{ page.name }}</span>
                    <span v-if="page.route" class="page-route">{{ page.route }}</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>

        <div class="toolbar-right">
          <el-button type="primary" @click="refreshPreview" icon="Refresh">刷新预览</el-button>
          <el-button type="primary" plain @click="openExportDialog" icon="Download">
            导出源码
          </el-button>
        </div>
      </div>

      <el-tabs v-model="activePreviewTab" class="preview-tabs" type="border-card">
        <el-tab-pane label="运行画布" name="runtime">
          <div class="preview-container">
            <div class="preview-stage" ref="previewStage">
              <div v-if="topLevelComponents.length === 0" class="empty-state">
                <el-icon :size="64" color="#dcdfe6"><Document /></el-icon>
                <p>当前页面没有组件</p>
              </div>

              <RuntimeComponent
                v-for="comp in topLevelComponents"
                :key="comp.id"
                :component="comp"
                :allComponents="previewComponents"
                @trigger-event="handleComponentEvent"
              />
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="全站 JSON" name="json">
          <div class="json-viewer">
            <div class="json-toolbar">
              <div>
                <p class="section-title">项目结构 JSON</p>
                <p class="section-subtitle">同步所有页面与数据，便于全站调试</p>
              </div>
              <div class="json-actions">
                <el-button text size="small" @click="copyProjectJson" :disabled="!projectSnapshot">
                  <el-icon><CopyDocument /></el-icon>
                  复制
                </el-button>
                <el-button
                  text
                  size="small"
                  @click="downloadProjectJson"
                  :disabled="!projectSnapshot"
                >
                  <el-icon><Download /></el-icon>
                  下载
                </el-button>
              </div>
            </div>
            <el-scrollbar class="json-scroll">
              <pre class="json-block">{{ fullProjectJson }}</pre>
            </el-scrollbar>
          </div>
        </el-tab-pane>

        <el-tab-pane label="全站代码" name="code">
          <div class="code-preview">
            <div class="code-toolbar">
              <div class="section-info">
                <el-icon class="section-icon"><Files /></el-icon>
                <div>
                  <p class="section-title">生成目录结构</p>
                  <p class="section-subtitle">点击文件即可在右侧查看源码</p>
                </div>
              </div>
              <div class="code-options">
                <el-radio-group v-model="codePreviewOptions.language" size="small">
                  <el-radio-button label="ts">TypeScript</el-radio-button>
                  <el-radio-button label="js">JavaScript</el-radio-button>
                </el-radio-group>
                <el-checkbox v-model="codePreviewOptions.lint" size="small"
                  >含 ESLint/Prettier</el-checkbox
                >
              </div>
            </div>

            <div class="code-preview-layout">
              <div class="file-tree-panel">
                <el-tree
                  :data="fileTreeData"
                  :props="fileTreeProps"
                  node-key="path"
                  highlight-current
                  :expand-on-click-node="false"
                  :current-node-key="selectedFilePath"
                  @node-click="handleFileNodeClick"
                />
              </div>

              <div class="code-viewer-panel">
                <div class="code-viewer-header">
                  <span class="file-path">{{ selectedFilePath || '选择一个文件以查看代码' }}</span>
                  <div class="code-actions">
                    <el-button
                      text
                      size="small"
                      @click="copyCurrentFile"
                      :disabled="!selectedFileContent"
                    >
                      <el-icon><CopyDocument /></el-icon>
                      复制
                    </el-button>
                    <el-button
                      text
                      size="small"
                      @click="downloadCurrentFile"
                      :disabled="!selectedFileContent"
                    >
                      <el-icon><Download /></el-icon>
                      下载
                    </el-button>
                  </div>
                </div>
                <el-scrollbar v-if="selectedFileContent" class="code-scroll">
                  <pre class="code-block">{{ selectedFileContent }}</pre>
                </el-scrollbar>
                <div v-else class="code-empty">
                  <p>请选择左侧文件查看源码。</p>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProjectStore } from '@/stores/project'
import { ElMessage } from 'element-plus'
import RuntimeComponent from '@/views/RuntimeComponent.vue'
import * as projectService from '@/services/projects'
import ExportConfigDialog from '@/components/dialogs/ExportConfigDialog.vue'
import {
  generateProjectSourceFiles,
  type ExportOptions,
  type GeneratedSourceFile,
} from '@/utils/projectGenerator'
import type { Component, EventAction } from '@/types/components'
import type { Page, Project } from '@/stores/project'
import {
  Loading,
  Document,
  ArrowDown,
  Check,
  CopyDocument,
  Files,
  Download,
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const projectStore = useProjectStore()

// 预览页面使用独立的本地组件状态，不依赖 componentStore
// 这样可以避免编辑器和预览页面之间的状态污染
const previewComponents = ref<Component[]>([])
const previewStage = ref<HTMLDivElement | null>(null)
const isLoading = ref(true)
const projectName = ref('')
const currentPageName = ref('')
const currentPageId = ref('')
const allPages = ref<Page[]>([])
const projectSnapshot = ref<Project | null>(null)
const exportDialogVisible = ref(false)
const activePreviewTab = ref<'runtime' | 'json' | 'code'>('runtime')
const codePreviewOptions = reactive<ExportOptions>({ language: 'ts', lint: true })
const generatedFiles = ref<GeneratedSourceFile[]>([])
const selectedFilePath = ref('')
const fileTreeProps = Object.freeze({ children: 'children', label: 'label' })

// 从 URL 获取项目和页面信息
const projectId = computed(() => (route.query.projectId as string) || (route.params.id as string))
const initialPageId = computed(() => route.query.pageId as string)
const isProjectMode = computed(() => route.query.mode === 'project')
const fullProjectJson = computed(() =>
  projectSnapshot.value ? JSON.stringify(projectSnapshot.value, null, 2) : '// 尚未加载项目',
)
const fileTreeData = computed<FileTreeNode[]>(() => sortTree(buildFileTree(generatedFiles.value)))
const selectedFileContent = computed(() => {
  return generatedFiles.value.find((file) => file.path === selectedFilePath.value)?.content || ''
})

// 加载指定页面的组件
async function loadPage(pageId: string) {
  const page = allPages.value.find((p) => p.id === pageId)
  if (page) {
    currentPageId.value = page.id
    currentPageName.value = page.name
    // 深拷贝页面组件数据到本地状态，避免直接引用
    previewComponents.value = JSON.parse(JSON.stringify(page.components || []))
  }
}

// 页面导航
function navigateToPage(pageId: string) {
  loadPage(pageId)

  // 更新 URL（不刷新页面）
  const query = { ...route.query, pageId }
  router.replace({ query })
}

// 加载预览数据
onMounted(async () => {
  if (!projectId.value) {
    ElMessage.error('缺少项目ID')
    router.push('/')
    return
  }

  isLoading.value = true

  try {
    // 优先使用本地store中的最新项目数据，避免服务器延迟导致的数据不一致
    const localProject = projectStore.currentProject
    if (localProject) {
      syncProjectContext(localProject)
    } else {
      const serverProject = await projectService.getProject(projectId.value)
      if (serverProject) {
        syncProjectContext(serverProject)
      } else {
        throw new Error('Server returned null')
      }
    }
  } catch (error) {
    console.warn('加载项目失败:', error)
    ElMessage.error('加载项目失败')
    router.push('/')
    return
  }

  // 确定要加载的页面
  let targetPageId = initialPageId.value

  if (!targetPageId && allPages.value.length > 0) {
    // 如果没有指定页面，默认加载第一个页面
    targetPageId = allPages.value[0]?.id || ''
  }

  if (targetPageId) {
    await loadPage(targetPageId)
  } else {
    ElMessage.warning('项目中没有页面')
  }

  isLoading.value = false
})

// 监听路由变化（用于项目模式下的页面切换）
watch(
  () => route.query.pageId,
  (newPageId) => {
    if (newPageId && typeof newPageId === 'string' && newPageId !== currentPageId.value) {
      loadPage(newPageId)
    }
  },
)

// 只渲染顶层组件
const topLevelComponents = computed(() => {
  return previewComponents.value.filter((c: Component) => !c.groupId)
})

// 处理组件事件
async function handleComponentEvent(payload: {
  componentId: string
  eventType: string
  actions: EventAction[]
}) {
  const { componentId, actions } = payload
  const sourceComp = previewComponents.value.find((c: Component) => c.id === componentId)

  for (const action of actions) {
    await executeAction(action, sourceComp)
  }
}

// 执行事件动作
async function executeAction(action: EventAction, sourceComponent?: Component): Promise<void> {
  // 延迟执行
  if (action.delay && action.delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, action.delay))
  }

  switch (action.type) {
    case 'toggle-visibility':
      if (action.targetId) {
        const target = previewComponents.value.find((c: Component) => c.id === action.targetId)
        if (target) {
          // 确保style对象存在
          if (!target.style) {
            target.style = { visible: true }
          }
          // 切换可见性: undefined默认为true(可见)
          const currentVisible = target.style.visible !== false
          target.style.visible = !currentVisible
        }
      }
      break

    case 'scroll-to':
      if (action.targetId) {
        const element = document.querySelector(`[data-component-id="${action.targetId}"]`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
      break

    case 'show-tooltip':
      if (action.content) {
        ElMessage.info(action.content)
      }
      break

    case 'navigate':
      // 检查是否是内部页面跳转
      if (action.content) {
        // 如果内容是页面ID或路由，尝试内部跳转
        const targetPage = allPages.value.find(
          (p) => p.id === action.content || p.route === action.content || p.name === action.content,
        )

        if (targetPage && isProjectMode.value) {
          // 项目模式下支持内部页面跳转
          navigateToPage(targetPage.id)
        } else if (action.content.startsWith('http') || action.content.startsWith('/')) {
          // 外部链接或绝对路径
          window.open(action.content, '_blank')
        } else {
          // 尝试作为相对路由处理
          const pageByRoute = allPages.value.find((p) => p.route === `/${action.content}`)
          if (pageByRoute && isProjectMode.value) {
            navigateToPage(pageByRoute.id)
          } else {
            window.open(action.content, '_blank')
          }
        }
      }
      break

    case 'navigate-page':
      // 新增：专门用于页面间跳转的动作类型
      if (action.targetId && isProjectMode.value) {
        const targetPage = allPages.value.find((p) => p.id === action.targetId)
        if (targetPage) {
          navigateToPage(targetPage.id)
        } else {
          ElMessage.warning('目标页面不存在')
        }
      }
      break

    case 'fullscreen':
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        document.documentElement.requestFullscreen()
      }
      break

    case 'custom-script':
      if (action.content) {
        try {
          // 提供页面导航能力给自定义脚本
          const fn = new Function(
            'component',
            'components',
            'navigateToPage',
            'allPages',
            action.content,
          )
          fn(sourceComponent, previewComponents.value, navigateToPage, allPages.value)
        } catch (error) {
          console.error('执行自定义脚本失败:', error)
        }
      }
      break

    default:
      console.log(`执行动作: ${action.type}`, action)
  }
}

// 返回编辑器
function backToEditor() {
  if (projectId.value) {
    router.push(`/editor/${projectId.value}`)
  } else {
    router.push('/')
  }
}

function refreshPreview() {
  window.location.reload()
}

function copyProjectJson() {
  if (!projectSnapshot.value) return
  copyToClipboard(fullProjectJson.value, '全站 JSON 已复制')
}

function downloadProjectJson() {
  if (!projectSnapshot.value) return
  const blob = new Blob([fullProjectJson.value], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${projectName.value || 'project'}-full.json`
  a.click()
  URL.revokeObjectURL(url)
}

function handleFileNodeClick(node: FileTreeNode) {
  if (node.isLeaf) {
    selectedFilePath.value = node.path
  }
}

function copyCurrentFile() {
  if (!selectedFileContent.value) return
  copyToClipboard(selectedFileContent.value, '源码已复制')
}

function downloadCurrentFile() {
  if (!selectedFileContent.value || !selectedFilePath.value) return
  const blob = new Blob([selectedFileContent.value], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = selectedFilePath.value.split('/').pop() || 'file'
  a.click()
  URL.revokeObjectURL(url)
}

function openExportDialog() {
  if (!projectSnapshot.value) {
    ElMessage.warning('当前没有可导出的项目')
    return
  }
  exportDialogVisible.value = true
}

watch(
  () => [projectSnapshot.value, codePreviewOptions.language, codePreviewOptions.lint],
  () => {
    if (!projectSnapshot.value) {
      generatedFiles.value = []
      selectedFilePath.value = ''
      return
    }

    try {
      const files = generateProjectSourceFiles(projectSnapshot.value, {
        language: codePreviewOptions.language,
        lint: codePreviewOptions.lint,
      })
      generatedFiles.value = files
      if (!files.find((file) => file.path === selectedFilePath.value)) {
        selectedFilePath.value = files[0]?.path || ''
      }
    } catch (error) {
      console.error('生成项目源码失败:', error)
      ElMessage.error('生成源码失败，请稍后重试')
    }
  },
  { immediate: true },
)

function syncProjectContext(project: Project) {
  projectName.value = project.name
  allPages.value = project.pages || []
  projectSnapshot.value = cloneProject(project)
}

function cloneProject(project: Project): Project {
  return JSON.parse(JSON.stringify(project))
}

interface FileTreeNode {
  label: string
  path: string
  isLeaf?: boolean
  children?: FileTreeNode[]
}

function buildFileTree(files: GeneratedSourceFile[]): FileTreeNode[] {
  const root: FileTreeNode[] = []
  for (const file of files) {
    const segments = file.path.split('/')
    let currentLevel = root
    let currentPath = ''
    segments.forEach((segment, index) => {
      currentPath = currentPath ? `${currentPath}/${segment}` : segment
      let node = currentLevel.find((item) => item.label === segment)
      if (!node) {
        node = {
          label: segment,
          path: currentPath,
          isLeaf: index === segments.length - 1,
          children: index === segments.length - 1 ? undefined : [],
        }
        currentLevel.push(node)
      }

      if (index === segments.length - 1) {
        node.isLeaf = true
      } else {
        node.children = node.children || []
        currentLevel = node.children
      }
    })
  }
  return root
}

function sortTree(nodes: FileTreeNode[]): FileTreeNode[] {
  return nodes
    .slice()
    .sort((a, b) => {
      if (!!a.isLeaf === !!b.isLeaf) {
        return a.label.localeCompare(b.label)
      }
      return a.isLeaf ? 1 : -1
    })
    .map((node) => ({
      ...node,
      children: node.children ? sortTree(node.children) : undefined,
    }))
}

async function copyToClipboard(payload: string, successMessage: string) {
  try {
    await navigator.clipboard.writeText(payload)
    ElMessage.success(successMessage)
  } catch (error) {
    try {
      const textarea = document.createElement('textarea')
      textarea.value = payload
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      ElMessage.success(successMessage)
    } catch (fallbackError) {
      console.warn('复制失败', error, fallbackError)
      ElMessage.error('复制失败，请手动复制')
    }
  }
}
</script>

<style scoped>
.runtime-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #0b0d16;
  color: #e5e9f0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #0f111f;
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
  color: #8a92b2;
  font-size: 14px;
  margin: 0;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background-color: #121526;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.25);
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 12px;
}

.project-name {
  font-weight: 600;
  font-size: 16px;
  color: #f5f7ff;
}

.page-name {
  font-size: 14px;
  color: #8a92b2;
}

.mode-tag {
  margin-left: 8px;
}

.page-nav {
  margin-left: 24px;
}

.page-nav :deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-nav :deep(.el-dropdown-menu__item.is-active) {
  color: var(--el-color-primary);
  font-weight: 500;
}

.page-route {
  font-size: 12px;
  color: #5f668c;
  font-family: 'JetBrains Mono', Consolas, monospace;
  margin-left: auto;
}

:deep(.el-tabs__content) {
  background: transparent;
}

.preview-tabs {
  flex: 1;
  padding: 16px 24px 24px;
  overflow: hidden;
}

.preview-tabs :deep(.el-tabs__header) {
  background: transparent;
}

.preview-tabs :deep(.el-tabs__item) {
  color: #8a92b2;
}

.preview-tabs :deep(.el-tabs__item.is-active) {
  color: #f5f7ff;
}

.preview-container {
  flex: 1;
  overflow: auto;
  padding: 16px;
  background-color: #0f111f;
  border-radius: 12px;
}

.preview-stage {
  position: relative;
  width: 1920px;
  height: 1080px;
  background-color: #fff;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
  margin: 0 auto;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #8a92b2;
  gap: 16px;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

.json-viewer,
.code-preview {
  background-color: #0f111f;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  min-height: 480px;
}

.json-toolbar,
.code-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.section-title {
  margin: 0;
  font-weight: 600;
  color: #f5f7ff;
}

.section-subtitle {
  margin: 2px 0 0;
  font-size: 12px;
  color: #8a92b2;
}

.section-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-icon {
  font-size: 18px;
  color: #6ab7ff;
}

.json-actions,
.code-actions,
.code-options {
  display: flex;
  align-items: center;
  gap: 8px;
}

.json-scroll {
  margin-top: 12px;
  max-height: 540px;
}

.json-block,
.code-block {
  margin: 0;
  background: #05060d;
  border-radius: 10px;
  padding: 16px;
  color: #d1e5ff;
  font-family: 'JetBrains Mono', Consolas, Monaco, monospace;
  font-size: 13px;
  line-height: 1.5;
  white-space: pre;
}

.code-preview {
  display: flex;
  flex-direction: column;
  min-height: 520px;
}

.code-preview-layout {
  margin-top: 16px;
  display: flex;
  gap: 16px;
  flex: 1;
  min-height: 420px;
}

.file-tree-panel {
  width: 320px;
  background: #0b0d16;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 12px;
}

.file-tree-panel :deep(.el-tree) {
  background: transparent;
  color: #cfd8ff;
}

.file-tree-panel :deep(.el-tree-node.is-current > .el-tree-node__content) {
  background: rgba(64, 158, 255, 0.2);
}

.code-viewer-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #05060d;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.code-viewer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.file-path {
  font-family: 'JetBrains Mono', Consolas, Monaco, monospace;
  font-size: 13px;
  color: #8f9ac8;
}

.code-scroll {
  flex: 1;
}

.code-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5f668c;
}

.code-block {
  min-height: 320px;
}

.code-options :deep(.el-radio-button__inner) {
  background: transparent;
  color: #cfd8ff;
}

.code-options :deep(.el-radio-button__orig-radio:checked + .el-radio-button__inner) {
  background-color: var(--el-color-primary);
  color: #fff;
}

.code-options :deep(.el-checkbox__label) {
  color: #cfd8ff;
}
</style>
