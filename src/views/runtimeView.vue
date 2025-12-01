<template>
  <div class="runtime-view">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-container">
      <el-icon class="loading-icon" :size="48"><Loading /></el-icon>
      <p class="loading-text">正在加载预览...</p>
    </div>

    <template v-else>
      <!-- 顶部工具栏 -->
      <div class="toolbar">
        <el-button type="info" @click="backToEditor" icon="Back">返回编辑器</el-button>
        <div class="toolbar-info">
          <span class="project-name">{{ projectName }}</span>
          <span class="page-name" v-if="currentPageName">/ {{ currentPageName }}</span>
          <el-tag v-if="isProjectMode" type="success" size="small" class="mode-tag">
            项目预览
          </el-tag>
          <el-tag v-else type="info" size="small" class="mode-tag"> 单页预览 </el-tag>
        </div>

        <!-- 项目模式下显示页面导航 -->
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

        <div class="toolbar-divider"></div>
        <el-button type="primary" @click="refreshPreview" icon="Refresh">刷新预览</el-button>
        <el-button @click="viewJSON" icon="Document">查看JSON</el-button>
        <el-button @click="viewCode" icon="View">查看代码</el-button>
        <el-button @click="exportVue" icon="Download">导出Vue文件</el-button>
      </div>

      <!-- 预览区域 -->
      <div class="preview-container">
        <div class="preview-stage" ref="previewStage">
          <!-- 空状态 -->
          <div v-if="topLevelComponents.length === 0" class="empty-state">
            <el-icon :size="64" color="#dcdfe6"><Document /></el-icon>
            <p>当前页面没有组件</p>
          </div>

          <!-- 动态渲染组件 - 使用运行时渲染器 -->
          <RuntimeComponent
            v-for="comp in topLevelComponents"
            :key="comp.id"
            :component="comp"
            :allComponents="previewComponents"
            @trigger-event="handleComponentEvent"
          />
        </div>
      </div>
    </template>

    <!-- JSON查看对话框 -->
    <el-dialog v-model="jsonDialogVisible" title="组件JSON数据" width="60%">
      <el-input
        v-model="jsonContent"
        type="textarea"
        :rows="20"
        readonly
        style="font-family: monospace"
      />
      <template #footer>
        <el-button @click="copyJSON">复制</el-button>
        <el-button type="primary" @click="jsonDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 代码查看对话框 -->
    <el-dialog v-model="codeDialogVisible" title="生成的Vue代码" width="70%">
      <el-input
        v-model="vueCode"
        type="textarea"
        :rows="25"
        readonly
        style="font-family: monospace; font-size: 12px"
      />
      <template #footer>
        <el-button @click="copyCode">复制</el-button>
        <el-button type="primary" @click="codeDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProjectStore } from '@/stores/project'
import { generateVueCode, componentsToJSON } from '@/utils/toCode'
import { ElMessage } from 'element-plus'
import RuntimeComponent from '@/views/RuntimeComponent.vue'
import * as projectService from '@/services/projects'
import type { Component, EventAction } from '@/types/components'
import type { Page } from '@/stores/project'
import { Loading, Document, ArrowDown, Check } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const projectStore = useProjectStore()

// 预览页面使用独立的本地组件状态，不依赖 componentStore
// 这样可以避免编辑器和预览页面之间的状态污染
const previewComponents = ref<Component[]>([])

const previewStage = ref<HTMLDivElement | null>(null)
const jsonDialogVisible = ref(false)
const codeDialogVisible = ref(false)
const jsonContent = ref('')
const vueCode = ref('')
const isLoading = ref(true)
const projectName = ref('')
const currentPageName = ref('')
const currentPageId = ref('')

// 项目所有页面（用于项目级预览时的页面导航）
const allPages = ref<Page[]>([])

// 从 URL 获取项目和页面信息
const projectId = computed(() => (route.query.projectId as string) || (route.params.id as string))
const initialPageId = computed(() => route.query.pageId as string)
const isProjectMode = computed(() => route.query.mode === 'project')

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
      projectName.value = localProject.name
      allPages.value = localProject.pages || []
    } else {
      // 本地没有，尝试从服务器获取
      const serverProject = await projectService.getProject(projectId.value)
      if (serverProject) {
        projectName.value = serverProject.name
        allPages.value = serverProject.pages || []
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

// 刷新预览
function refreshPreview() {
  window.location.reload()
}

// 查看JSON
function viewJSON() {
  jsonContent.value = componentsToJSON(previewComponents.value)
  jsonDialogVisible.value = true
}

// 查看代码
function viewCode() {
  vueCode.value = generateVueCode(previewComponents.value)
  codeDialogVisible.value = true
}

// 复制JSON
function copyJSON() {
  navigator.clipboard.writeText(jsonContent.value)
  ElMessage.success('JSON已复制到剪贴板')
}

// 复制代码
function copyCode() {
  navigator.clipboard.writeText(vueCode.value)
  ElMessage.success('代码已复制到剪贴板')
}

// 导出Vue文件
function exportVue() {
  const code = generateVueCode(previewComponents.value)
  const blob = new Blob([code], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${currentPageName.value || 'page'}-${Date.now()}.vue`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  ElMessage.success('Vue文件已导出')
}
</script>

<style scoped>
.runtime-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f7fa;
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

.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background-color: #fff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.toolbar-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 12px;
}

.project-name {
  font-weight: 600;
  font-size: 15px;
  color: var(--el-text-color-primary);
}

.page-name {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.mode-tag {
  margin-left: 8px;
}

.page-nav {
  margin-left: auto;
  margin-right: 8px;
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
  color: var(--el-text-color-placeholder);
  font-family: monospace;
  margin-left: auto;
}

.toolbar-divider {
  width: 1px;
  height: 24px;
  background-color: #e5e7eb;
  margin: 0 4px;
}

.preview-container {
  flex: 1;
  overflow: auto;
  padding: 20px;
}

.preview-stage {
  position: relative;
  width: 1920px;
  height: 1080px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--el-text-color-placeholder);
  gap: 16px;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

:deep(.el-dialog__body) {
  padding: 10px 20px;
}

:deep(.el-textarea__inner) {
  font-family: 'Courier New', Courier, monospace;
}
</style>
