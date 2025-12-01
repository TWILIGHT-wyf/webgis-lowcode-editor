import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { nanoid } from 'nanoid'
import { debounce } from 'lodash-es'
import { useComponent } from '@/stores/component'
import { ElMessage } from 'element-plus'
import type { Component } from '@/types/components'
import type { ServerProject } from '@/types/api'
import * as projectService from '@/services/projects'

// —— 类型定义 ——
export type SaveStatus = 'saved' | 'saving' | 'unsaved'

export interface Page {
  id: string
  name: string
  route?: string // 页面路由路径
  thumbnail?: string // 页面缩略图 (Base64)
  components: Component[] // 页面包含的组件数据
  canvasSettings?: {
    // 每个页面独立的画布设置 (可选)
    width: number
    height: number
    backgroundColor: string
  }
}

export interface Project {
  id: string
  name: string
  cover?: string // 项目封面
  description?: string
  createdAt: number
  updatedAt: number
  pages: Page[]
}

export const useProjectStore = defineStore('project', () => {
  const componentStore = useComponent()

  // —— State ——
  // 所有项目列表 (实际开发中应从后端获取)
  const projectList = ref<Project[]>([])

  // 当前激活的项目 ID
  const currentProjectId = ref<string | null>(null)

  // 当前激活的页面 ID
  const activePageId = ref<string | null>(null)

  // 保存状态: 'saved' | 'saving' | 'unsaved'
  const saveStatus = ref<SaveStatus>('saved')

  // 最后保存时间戳
  const lastSavedTime = ref<number | null>(null)

  // —— Getters ——
  const currentProject = computed(
    () => projectList.value.find((p) => p.id === currentProjectId.value) || null,
  )

  const activePage = computed(
    () => currentProject.value?.pages.find((p) => p.id === activePageId.value) || null,
  )

  // —— 三层保存策略核心逻辑 ——

  // Layer 3: 后端持久化保存（模拟 API 请求）
  async function saveToBackend(): Promise<void> {
    if (!currentProjectId.value || !activePageId.value || !activePage.value) {
      return
    }

    saveStatus.value = 'saving'

    try {
      // 模拟 API 请求延迟 500ms
      await new Promise((resolve) => setTimeout(resolve, 500))

      // 获取当前画布数据
      const currentComponents = JSON.parse(JSON.stringify(componentStore.componentStore))

      // 更新当前页面的组件数据
      if (activePage.value) {
        activePage.value.components = currentComponents
      }

      // 更新项目修改时间
      if (currentProject.value) {
        currentProject.value.updatedAt = Date.now()
      }

      // 持久化到 localStorage（项目列表）
      saveToLocalStorage()

      // 清除草稿（后端已同步）
      clearDraft()

      // 更新状态
      saveStatus.value = 'saved'
      lastSavedTime.value = Date.now()

      console.log('[SaveStrategy] 后端同步成功:', {
        projectId: currentProjectId.value,
        pageId: activePageId.value,
        time: new Date().toLocaleTimeString(),
      })
    } catch (error) {
      console.error('[SaveStrategy] 后端同步失败:', error)
      saveStatus.value = 'unsaved'
      ElMessage.error('保存失败，请重试')
    }
  }

  // 防抖包裹的后端保存函数（3秒延迟）
  const saveToBackendDebounced = debounce(saveToBackend, 3000, {
    leading: false,
    trailing: true,
  })

  // Layer 2: 本地草稿存储（防丢失）
  function getDraftKey(): string {
    return `webgis_draft_${currentProjectId.value}_${activePageId.value}`
  }

  function saveDraft(): void {
    if (!currentProjectId.value || !activePageId.value) return

    const draftData = {
      components: JSON.parse(JSON.stringify(componentStore.componentStore)),
      timestamp: Date.now(),
      projectId: currentProjectId.value,
      pageId: activePageId.value,
    }

    localStorage.setItem(getDraftKey(), JSON.stringify(draftData))
    console.log('[SaveStrategy] 草稿已保存到 localStorage:', getDraftKey())
  }

  function loadDraft(): { components: Component[]; timestamp: number } | null {
    const draftKey = getDraftKey()
    const draftStr = localStorage.getItem(draftKey)
    if (!draftStr) return null

    try {
      const draft = JSON.parse(draftStr)
      return {
        components: draft.components,
        timestamp: draft.timestamp,
      }
    } catch (e) {
      console.error('[SaveStrategy] 解析草稿失败:', e)
      return null
    }
  }

  function clearDraft(): void {
    const draftKey = getDraftKey()
    localStorage.removeItem(draftKey)
    console.log('[SaveStrategy] 草稿已清除:', draftKey)
  }

  // 检查是否有更新的草稿
  function checkAndRecoverDraft(): boolean {
    if (!activePage.value) return false

    const draft = loadDraft()
    if (!draft) return false

    // 比较草稿时间和页面最后更新时间
    const pageLastUpdate = currentProject.value?.updatedAt || 0

    if (draft.timestamp > pageLastUpdate) {
      console.log('[SaveStrategy] 发现更新的草稿，时间差:', draft.timestamp - pageLastUpdate, 'ms')
      return true
    }

    return false
  }

  // 恢复草稿数据
  function recoverFromDraft(): void {
    const draft = loadDraft()
    if (draft) {
      componentStore.loadTemplate(draft.components)
      saveStatus.value = 'unsaved'
      ElMessage.success('已恢复未保存的草稿')
    }
  }

  // —— Watcher: 监听组件变化 ——
  // 注意：需要在 store 初始化完成后设置 watcher
  let watcherInitialized = false

  function initWatcher(): void {
    if (watcherInitialized) return
    watcherInitialized = true

    watch(
      () => componentStore.componentStore,
      () => {
        // 只有在有活动项目和页面时才触发保存
        if (!currentProjectId.value || !activePageId.value) return

        // Layer 1: 立即更新状态为未保存
        saveStatus.value = 'unsaved'

        // Layer 2: 立即存入 localStorage 草稿（防崩溃丢失）
        saveDraft()

        // Layer 3: 触发防抖后端同步
        saveToBackendDebounced()
      },
      {
        deep: true,
        // 使用 flush: 'post' 确保在 DOM 更新后触发
        flush: 'post',
      },
    )

    console.log('[SaveStrategy] Watcher 已初始化')
  }

  // —— Actions ——

  // 1. 初始化/加载项目
  function loadProject(projectId: string) {
    const project = projectList.value.find((p) => p.id === projectId)
    if (!project) {
      console.error(`Project ${projectId} not found`)
      return false
    }

    currentProjectId.value = projectId

    // 默认选中第一个页面
    const firstPage = project.pages[0]
    if (project.pages.length > 0 && firstPage) {
      // 这里不直接调用 switchPage，避免重复保存空状态
      activePageId.value = firstPage.id
      // 将页面数据加载到画布 Store
      componentStore.reset() // 先清空
      // 这里的 loadTemplate 是借用现有的方法来填充数据
      componentStore.loadTemplate(firstPage.components)

      // 初始化 watcher（仅在首次加载项目时）
      initWatcher()

      // 重置保存状态
      saveStatus.value = 'saved'
      lastSavedTime.value = project.updatedAt
    }
    return true
  }

  // 2. 切换页面 (核心联动逻辑)
  function switchPage(pageId: string) {
    if (activePageId.value === pageId) return
    if (!currentProject.value) return

    // A. 切换前：强制执行挂起的保存操作（防止数据丢失）
    saveToBackendDebounced.flush()

    // B. 切换前：保存当前画布数据到"旧页面"
    if (activePageId.value) {
      saveCurrentPageSnapshot()
    }

    // C. 查找新页面数据
    const newPage = currentProject.value.pages.find((p) => p.id === pageId)
    if (!newPage) return

    // D. 切换后：将新页面数据加载到画布
    activePageId.value = pageId

    // 使用 loadTemplate 深度拷贝数据到 componentStore，防止引用污染
    componentStore.loadTemplate(newPage.components)

    // E. 检查是否有比服务器更新的草稿
    if (checkAndRecoverDraft()) {
      // 提示用户是否恢复草稿
      ElMessage.info({
        message: '检测到未保存的草稿，点击恢复',
        duration: 5000,
        showClose: true,
        onClose: () => {
          // 用户关闭提示，不恢复
        },
      })
      // 这里可以选择自动恢复或让用户手动选择
      // recoverFromDraft()
    }

    // 重置保存状态
    saveStatus.value = 'saved'
  }

  // 3. 保存当前画布快照 (用于自动保存或切换前保存)
  function saveCurrentPageSnapshot() {
    if (!activePage.value) return

    // 从 componentStore 获取当前所有组件
    // 注意：这里需要深拷贝，或者确保 componentStore.value 是纯数据
    const currentComponents = JSON.parse(JSON.stringify(componentStore.componentStore))

    activePage.value.components = currentComponents

    // 更新项目修改时间
    if (currentProject.value) {
      currentProject.value.updatedAt = Date.now()
      saveToLocalStorage() // 持久化
    }
  }

  // 4. 创建新项目（优先使用远程 API）
  async function createProject(name: string) {
    try {
      // 尝试调用远程 API
      const serverProject = await projectService.createProject({
        name: name || '未命名项目',
      })

      // 转换为本地格式
      const localProject: Project = {
        id: (serverProject as unknown as ServerProject)._id || nanoid(),
        name: serverProject.name,
        cover: serverProject.cover,
        description: serverProject.description,
        createdAt: new Date((serverProject as unknown as ServerProject).createdAt).getTime(),
        updatedAt: new Date((serverProject as unknown as ServerProject).updatedAt).getTime(),
        pages: serverProject.pages || [],
      }

      projectList.value.unshift(localProject)
      saveToLocalStorage()
      return localProject.id
    } catch (error) {
      console.warn('远程创建失败，使用本地模式:', error)
      // 降级为本地模式
      const newProject: Project = {
        id: nanoid(),
        name: name || '未命名项目',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        pages: [
          {
            id: nanoid(),
            name: '主页面',
            components: [],
          },
        ],
      }
      projectList.value.unshift(newProject)
      saveToLocalStorage()
      return newProject.id
    }
  }

  // 5. 新增页面
  function addPage(name: string = '新页面', route?: string) {
    if (!currentProject.value) return

    const newPage: Page = {
      id: nanoid(),
      name,
      route,
      components: [],
    }
    currentProject.value.pages.push(newPage)

    // 自动切换到新页面
    switchPage(newPage.id)
    saveToLocalStorage()
  }

  // 6. 重命名页面
  function renamePage(pageId: string, newName: string, newRoute?: string) {
    if (!currentProject.value) return
    const page = currentProject.value.pages.find((p) => p.id === pageId)
    if (page) {
      page.name = newName
      if (newRoute !== undefined) {
        page.route = newRoute
      }

      // 更新保存状态和时间戳
      saveStatus.value = 'unsaved'
      currentProject.value.updatedAt = Date.now()

      saveToLocalStorage()
    }
  }

  // 7. 删除页面
  function removePage(pageId: string) {
    if (!currentProject.value) return
    if (currentProject.value.pages.length <= 1) {
      ElMessage.warning('至少保留一个页面')
      return
    }

    const index = currentProject.value.pages.findIndex((p) => p.id === pageId)
    if (index > -1) {
      currentProject.value.pages.splice(index, 1)

      // 更新保存状态和时间戳
      saveStatus.value = 'unsaved'
      currentProject.value.updatedAt = Date.now()

      // 如果删除的是当前页，切换到第一个页面
      if (activePageId.value === pageId) {
        const firstPage = currentProject.value.pages[0]
        if (firstPage) {
          switchPage(firstPage.id)
        }
      }
      saveToLocalStorage()
    }
  }

  // 8. 删除项目
  function deleteProject(id: string) {
    const index = projectList.value.findIndex((p) => p.id === id)
    if (index > -1) {
      projectList.value.splice(index, 1)
      saveToLocalStorage()
    }
  }

  // —— 持久化 (Mock Database) ——
  function saveToLocalStorage() {
    localStorage.setItem('webgis_projects', JSON.stringify(projectList.value))
  }

  function initFromLocalStorage() {
    const localData = localStorage.getItem('webgis_projects')
    if (localData) {
      try {
        projectList.value = JSON.parse(localData)
      } catch (e) {
        console.error('Failed to load projects', e)
      }
    }
  }

  // 初始化
  initFromLocalStorage()

  return {
    // State
    projectList,
    currentProjectId,
    activePageId,
    saveStatus,
    lastSavedTime,

    // Getters
    currentProject,
    activePage,

    // Actions - 项目管理
    loadProject,
    createProject,
    deleteProject,

    // Actions - 页面管理
    switchPage,
    addPage,
    renamePage,
    removePage,

    // Actions - 保存相关
    saveCurrentPageSnapshot,
    saveToBackend,
    saveToBackendDebounced,
    saveDraft,
    loadDraft,
    clearDraft,
    checkAndRecoverDraft,
    recoverFromDraft,

    // Actions - 初始化
    initWatcher,
  }
})
