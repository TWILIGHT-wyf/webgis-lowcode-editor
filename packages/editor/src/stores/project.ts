import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ProjectSchema, PageSchema, PageConfig } from '@vela/core'
import { ElMessage } from 'element-plus'
import * as projectService from '@/services/projects'
import { convertLayout, type LayoutMode } from '@/utils/layoutConverter'

export type SaveStatus = 'saved' | 'saving' | 'unsaved'

/**
 * ��Ŀ���� Store
 * ���������ҳ���б�����ǰ��Ŀ���á�ҳ���л�
 */
export const useProjectStore = defineStore('project', () => {
  // ========== State ==========

  /**
   * ��ǰ��Ŀ���ݣ����� @vela/core �� ProjectSchema��
   */
  const project = ref<ProjectSchema>({
    version: '1.5.0',
    name: 'Untitled Project',
    description: '',
    config: {
      layout: 'pc',
      theme: 'light',
    },
    pages: [
      {
        id: 'page_default',
        name: 'Home',
        path: '/',
        config: {
          layout: 'free',
        },
        children: {
          id: 'root_container',
          componentName: 'Page',
          props: {},
          style: {
            width: '100%',
            height: '100%',
            position: 'relative',
          },
          children: [],
        },
      },
    ],
  })

  /**
   * ��ǰ�����ҳ�� ID
   */
  const activePageId = ref<string>('page_default')

  /**
   * ����״̬
   */
  const saveStatus = ref<SaveStatus>('saved')

  /**
   * ��󱣴�ʱ���
   */
  const lastSavedTime = ref<number | null>(null)

  // ========== Getters ==========

  /**
   * ��ȡ��ǰѡ�е�ҳ��
   */
  const currentPage = computed<PageSchema | null>(() => {
    return project.value.pages.find((p) => p.id === activePageId.value) || null
  })

  /**
   * ��ȡ��ǰҳ������
   */
  const currentPageIndex = computed(() => {
    return project.value.pages.findIndex((p) => p.id === activePageId.value)
  })

  /**
   * 获取当前页面的布局模式
   */
  const currentPageLayout = computed<LayoutMode>(() => {
    return currentPage.value?.config?.layout || 'free'
  })

  // ========== Actions ==========

  /**
   * ��ʼ����Ŀ����
   */
  function initProject(projectData: ProjectSchema) {
    project.value = projectData
    if (projectData.pages.length > 0) {
      activePageId.value = projectData.pages[0].id
    }
  }

  /**
   * �л�ҳ��
   * @param pageId ҳ�� ID
   */
  function switchPage(pageId: string) {
    const page = project.value.pages.find((p) => p.id === pageId)
    if (!page) {
      console.warn(`[ProjectStore] Page not found: ${pageId}`)
      return
    }

    activePageId.value = pageId
    console.log(`[ProjectStore] Switched to page: ${page.name}`)

    // ֪ͨ componentStore ���ظ�ҳ��� children
    // �⽫�� componentStore ��ͨ�� watch �Զ�����
  }

  /**
   * ������ҳ��
   */
  function addPage(name: string = 'New Page', layoutMode: LayoutMode = 'free') {
    const newPage: PageSchema = {
      id: `page_${Date.now()}`,
      name,
      path: `/${name.toLowerCase().replace(/\s+/g, '-')}`,
      config: {
        layout: layoutMode,
      },
      children: {
        id: `root_${Date.now()}`,
        componentName: 'Page',
        props: {},
        style: {
          width: '100%',
          height: '100%',
          position: 'relative',
        },
        children: [],
      },
    }

    project.value.pages.push(newPage)
    activePageId.value = newPage.id
    saveStatus.value = 'unsaved'

    ElMessage.success(`ҳ��"${name}"�Ѵ���`)
    return newPage.id
  }

  /**
   * ɾ��ҳ��
   */
  function deletePage(pageId: string) {
    const index = project.value.pages.findIndex((p) => p.id === pageId)
    if (index === -1) return

    if (project.value.pages.length === 1) {
      ElMessage.warning('���ٱ���һ��ҳ��')
      return
    }

    const deletedPage = project.value.pages[index]
    project.value.pages.splice(index, 1)

    // ���ɾ�����ǵ�ǰҳ�棬�л�����һ��ҳ��
    if (activePageId.value === pageId) {
      activePageId.value = project.value.pages[0].id
    }

    saveStatus.value = 'unsaved'
    ElMessage.success(`ҳ��"${deletedPage.name}"��ɾ��`)
  }

  /**
   * ������ҳ��
   */
  function renamePage(pageId: string, newName: string) {
    const page = project.value.pages.find((p) => p.id === pageId)
    if (page) {
      page.name = newName
      saveStatus.value = 'unsaved'
    }
  }

  /**
   * ������Ŀ����
   */
  function updateProjectConfig(config: Partial<ProjectSchema['config']>) {
    Object.assign(project.value.config, config)
    saveStatus.value = 'unsaved'
  }

  /**
   * ������ĿԪ��Ϣ
   */
  function updateProjectMeta(meta: { name?: string; description?: string }) {
    if (meta.name !== undefined) {
      project.value.name = meta.name
    }
    if (meta.description !== undefined) {
      project.value.description = meta.description
    }
    saveStatus.value = 'unsaved'
  }

  /**
   * 切换页面的布局模式
   * @param pageId 页面 ID
   * @param mode 目标布局模式 'free' | 'flow'
   * @returns 是否切换成功
   */
  function changePageLayout(pageId: string, mode: LayoutMode): boolean {
    const pageIndex = project.value.pages.findIndex((p) => p.id === pageId)
    if (pageIndex === -1) {
      console.warn(`[ProjectStore] Page not found: ${pageId}`)
      return false
    }

    const page = project.value.pages[pageIndex]

    // 如果是相同模式，跳过
    if (page.config?.layout === mode) {
      console.log(`[ProjectStore] Page already in ${mode} mode`)
      return true
    }

    // 转换组件树的布局
    if (page.children) {
      const convertedTree = convertLayout(page.children, mode)
      // 替换整个 children 对象以确保响应式更新
      page.children = convertedTree
    }

    // 更新页面配置
    if (!page.config) {
      page.config = { layout: mode }
    } else {
      page.config.layout = mode
    }

    // 触发响应式更新：用新对象替换页面引用
    project.value.pages[pageIndex] = { ...page }

    saveStatus.value = 'unsaved'
    console.log(`[ProjectStore] Changed page "${page.name}" layout to: ${mode}`)

    return true
  }

  /**
   * ������Ŀ�����
   */
  async function saveProject() {
    saveStatus.value = 'saving'

    try {
      // TODO: ���� projectService.saveProject(project.value)
      // const result = await projectService.saveProject(project.value)

      saveStatus.value = 'saved'
      lastSavedTime.value = Date.now()

      ElMessage.success('��Ŀ�ѱ���')
    } catch (error) {
      console.error('[ProjectStore] Save failed:', error)
      saveStatus.value = 'unsaved'
      ElMessage.error('����ʧ�ܣ�������')
    }
  }

  return {
    // State
    project,
    activePageId,
    saveStatus,
    lastSavedTime,

    // Getters
    currentPage,
    currentPageIndex,
    currentPageLayout,

    // Actions
    initProject,
    switchPage,
    addPage,
    deletePage,
    renamePage,
    updateProjectConfig,
    updateProjectMeta,
    changePageLayout,
    saveProject,
  }
})
