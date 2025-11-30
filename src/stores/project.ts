import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { nanoid } from 'nanoid'
import { useComponent } from '@/stores/component'
import { ElMessage } from 'element-plus'
import type { Component } from '@/types/components'
// —— 类型定义 ——
export interface Page {
  id: string
  name: string
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

  // —— Getters ——
  const currentProject = computed(
    () => projectList.value.find((p) => p.id === currentProjectId.value) || null,
  )

  const activePage = computed(
    () => currentProject.value?.pages.find((p) => p.id === activePageId.value) || null,
  )

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
    if (project.pages.length > 0) {
      // 这里不直接调用 switchPage，避免重复保存空状态
      activePageId.value = project.pages[0].id
      // 将页面数据加载到画布 Store
      componentStore.reset() // 先清空
      // 这里的 loadTemplate 是借用现有的方法来填充数据
      componentStore.loadTemplate(project.pages[0].components)
    }
    return true
  }

  // 2. 切换页面 (核心联动逻辑)
  function switchPage(pageId: string) {
    if (activePageId.value === pageId) return
    if (!currentProject.value) return

    // A. 切换前：保存当前画布数据到“旧页面”
    if (activePageId.value) {
      saveCurrentPageSnapshot()
    }

    // B. 查找新页面数据
    const newPage = currentProject.value.pages.find((p) => p.id === pageId)
    if (!newPage) return

    // C. 切换后：将新页面数据加载到画布
    activePageId.value = pageId

    // 使用 loadTemplate 深度拷贝数据到 componentStore，防止引用污染
    componentStore.loadTemplate(newPage.components)
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

  // 4. 创建新项目
  function createProject(name: string) {
    const newProject: Project = {
      id: nanoid(),
      name: name || '未命名项目',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      pages: [
        {
          id: nanoid(),
          name: '主页面',
          components: [], // 初始为空白页
        },
      ],
    }
    projectList.value.unshift(newProject)
    saveToLocalStorage()
    return newProject.id
  }

  // 5. 新增页面
  function addPage(name: string = '新页面') {
    if (!currentProject.value) return

    const newPage: Page = {
      id: nanoid(),
      name,
      components: [],
    }
    currentProject.value.pages.push(newPage)

    // 自动切换到新页面
    switchPage(newPage.id)
    saveToLocalStorage()
  }

  // 6. 重命名页面
  function renamePage(pageId: string, newName: string) {
    if (!currentProject.value) return
    const page = currentProject.value.pages.find((p) => p.id === pageId)
    if (page) {
      page.name = newName
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
      // 如果删除的是当前页，切换到第一个页面
      if (activePageId.value === pageId) {
        switchPage(currentProject.value.pages[0].id)
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
    projectList,
    currentProjectId,
    activePageId,
    currentProject,
    activePage,
    loadProject,
    switchPage,
    saveCurrentPageSnapshot,
    createProject,
    addPage,
    renamePage,
    removePage,
    deleteProject,
  }
})
