/**
 * V1.5 树形架构 - 简化版组件状态管理
 * 适配 Core 的树形协议
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ProjectSchema, PageSchema } from '@vela/core'
import type { NodeSchema } from '@vela/core'
import { findNodeById, generateId } from '@vela/core'

export const useComponentStoreV2 = defineStore('componentV2', () => {
  // ==================== 1. 项目数据源 (Single Source of Truth) ====================

  /**
   * 整个项目结构
   */
  const project = ref<ProjectSchema>({
    version: '1.5.0',
    name: 'Untitled Project',
    description: '',
    config: {
      layout: 'pc',
      theme: 'default',
    },
    pages: [
      {
        id: 'page_home',
        name: 'Home',
        path: '/',
        children: {
          id: 'root_container',
          componentName: 'Page',
          props: {
            title: 'Home Page',
          },
          style: {
            width: '100%',
            height: '100%',
            minHeight: '100vh',
            padding: '20px',
            backgroundColor: '#f0f2f5',
          },
          children: [],
        },
      },
    ],
  })

  /**
   * 当前激活的页面ID
   */
  const activePageId = ref('page_home')

  /**
   * 当前选中的组件ID
   */
  const selectedId = ref<string | null>(null)

  // ==================== 2. Getters ====================

  /**
   * 获取当前激活的页面
   */
  const activePage = computed(
    () => project.value.pages.find((p) => p.id === activePageId.value) || project.value.pages[0],
  )

  /**
   * 获取当前页面的组件树 (用于传递给 Renderer)
   */
  const currentTree = computed(() => activePage.value.children)

  /**
   * 获取当前选中组件
   */
  const selectedComponent = computed(() => {
    if (!selectedId.value || !currentTree.value) return null
    return findNodeById(currentTree.value, selectedId.value)
  })

  // ==================== 3. Actions ====================

  /**
   * 设置选中的组件
   */
  const setSelected = (id: string | null) => {
    selectedId.value = id
  }

  /**
   * 添加组件到指定父节点
   * @param componentName 组件名称
   * @param parentId 父节点ID，默认为根容器
   * @param props 组件属性
   * @param style 组件样式
   */
  const addComponent = (
    componentName: string,
    parentId?: string,
    props?: Record<string, any>,
    style?: Record<string, any>,
  ) => {
    const newNode: NodeSchema = {
      id: generateId(componentName),
      componentName,
      props: props || {},
      style: style || {
        position: 'relative',
        margin: '10px',
        padding: '10px',
      },
      children: [],
    }

    const root = currentTree.value
    if (!root) {
      console.error('[ComponentStore] No root container found')
      return null
    }

    // 如果没有 parentId，就添加到根容器
    if (!parentId || parentId === root.id) {
      root.children = root.children || []
      root.children.push(newNode)
    } else {
      const parent = findNodeById(root, parentId)
      if (parent) {
        parent.children = parent.children || []
        parent.children.push(newNode)
      } else {
        console.error('[ComponentStore] Parent not found:', parentId)
        return null
      }
    }

    return newNode.id
  }

  /**
   * 删除组件
   * @param id 组件ID
   */
  const removeComponent = (id: string): boolean => {
    const root = currentTree.value
    if (!root || id === root.id) return false

    const removeFromChildren = (parent: NodeSchema): boolean => {
      if (!parent.children) return false
      const index = parent.children.findIndex((child: NodeSchema) => child.id === id)
      if (index !== -1) {
        parent.children.splice(index, 1)
        return true
      }
      for (const child of parent.children) {
        if (removeFromChildren(child)) return true
      }
      return false
    }

    const result = removeFromChildren(root)
    if (result && selectedId.value === id) {
      selectedId.value = null
    }
    return result
  }

  /**
   * 更新组件属性
   */
  const updateComponentProps = (id: string, props: Record<string, any>) => {
    const node = selectedComponent.value
    if (node && node.id === id) {
      node.props = { ...node.props, ...props }
    } else {
      const target = findNodeById(currentTree.value, id)
      if (target) {
        target.props = { ...target.props, ...props }
      }
    }
  }

  /**
   * 更新组件样式
   */
  const updateComponentStyle = (id: string, style: Record<string, any>) => {
    const node = selectedComponent.value
    if (node && node.id === id) {
      node.style = { ...node.style, ...style }
    } else {
      const target = findNodeById(currentTree.value, id)
      if (target) {
        target.style = { ...target.style, ...style }
      }
    }
  }

  /**
   * 清除选中
   */
  const clearSelection = () => {
    selectedId.value = null
  }

  /**
   * 切换页面
   */
  const setActivePage = (pageId: string) => {
    const page = project.value.pages.find((p) => p.id === pageId)
    if (page) {
      activePageId.value = pageId
      clearSelection()
    }
  }

  return {
    // State
    project,
    activePageId,
    selectedId,

    // Getters
    activePage,
    currentTree,
    selectedComponent,

    // Actions
    setSelected,
    addComponent,
    removeComponent,
    updateComponentProps,
    updateComponentStyle,
    clearSelection,
    setActivePage,
  }
})
