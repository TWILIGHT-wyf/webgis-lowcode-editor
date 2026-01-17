/**
 * V1.5 树形架构 - 组件状态管理
 * 基于递归树结构的新 Store
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ProjectSchema, PageSchema, NodeSchema } from '@vela/core'
import { findNodeById, traverse } from '@vela/core'

export const useComponentStore = defineStore('componentTree', () => {
  // ==================== 1. 核心状态 ====================

  /**
   * 整个项目结构
   */
  const project = ref<ProjectSchema>({
    version: '1.5.0',
    name: 'My LowCode Project',
    config: { layout: 'pc', theme: 'light' },
    pages: [
      {
        id: 'page_root',
        name: 'Home',
        path: '/',
        children: {
          // 根节点通常是一个 Page 容器
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
   * 当前选中的页面索引
   */
  const currentPageIndex = ref(0)

  /**
   * 当前选中的组件ID
   */
  const selectedId = ref<string | null>(null)

  /**
   * 是否正在拖拽
   */
  const isDragging = ref(false)

  // ==================== 2. Getters ====================

  /**
   * 当前页面
   */
  const currentPage = computed(() => project.value.pages[currentPageIndex.value])

  /**
   * 获取当前页面的组件树根节点
   */
  const currentTree = computed(() => currentPage.value?.children)

  /**
   * 获取当前选中组件的 Schema
   */
  const selectedComponent = computed(() => {
    if (!selectedId.value || !currentTree.value) return null
    return findNodeById(currentTree.value, selectedId.value)
  })

  /**
   * 获取所有组件的扁平列表（用于兼容旧逻辑）
   */
  const flatComponents = computed(() => {
    const list: NodeSchema[] = []
    if (currentTree.value) {
      traverse(currentTree.value, (node: NodeSchema) => {
        list.push(node)
      })
    }
    return list
  })

  // ==================== 3. Actions ====================

  /**
   * 生成唯一ID
   */
  const generateId = (componentName: string) => {
    return `${componentName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * 添加组件
   * @param schema 组件数据（不含ID）
   * @param parentId 父节点ID (如果不传，默认添加到根节点)
   * @param index 插入位置（可选）
   */
  const addComponent = (
    schema: Omit<NodeSchema, 'id'>,
    parentId?: string,
    index?: number,
  ): string | null => {
    const newId = generateId(schema.componentName)
    const newNode: NodeSchema = {
      ...schema,
      id: newId,
      children: schema.children || [],
    }

    const root = currentTree.value
    if (!root) return null

    // 如果没有指定父节点，或者父节点就是根容器
    if (!parentId || parentId === root.id) {
      if (!root.children) root.children = []
      if (index !== undefined && index >= 0) {
        root.children.splice(index, 0, newNode)
      } else {
        root.children.push(newNode)
      }
    } else {
      // 递归查找父节点
      const parent = findNodeById(root, parentId)
      if (parent) {
        if (!parent.children) parent.children = []
        if (index !== undefined && index >= 0) {
          parent.children.splice(index, 0, newNode)
        } else {
          parent.children.push(newNode)
        }
      } else {
        console.error('[ComponentStore] Parent node not found:', parentId)
        return null
      }
    }

    return newId
  }

  /**
   * 删除组件
   * @param id 要删除的组件ID
   */
  const removeComponent = (id: string): boolean => {
    const root = currentTree.value
    if (!root) return false

    // 不能删除根节点
    if (id === root.id) {
      console.warn('[ComponentStore] Cannot remove root node')
      return false
    }

    // 递归查找并删除
    const removeFromChildren = (parent: NodeSchema): boolean => {
      if (!parent.children) return false
      const index = parent.children.findIndex((child: NodeSchema) => child.id === id)
      if (index !== -1) {
        parent.children.splice(index, 1)
        return true
      }
      // 递归搜索子节点
      for (const child of parent.children) {
        if (removeFromChildren(child)) return true
      }
      return false
    }

    const result = removeFromChildren(root)

    // 如果删除的是当前选中的组件，清除选中状态
    if (result && selectedId.value === id) {
      selectedId.value = null
    }

    return result
  }

  /**
   * 更新组件属性
   * @param id 组件ID
   * @param props 要更新的属性
   */
  const updateComponentProps = (id: string, props: Record<string, any>) => {
    const root = currentTree.value
    if (!root) return

    const node = findNodeById(root, id)
    if (node) {
      node.props = { ...node.props, ...props }
    }
  }

  /**
   * 更新组件样式
   * @param id 组件ID
   * @param style 要更新的样式
   */
  const updateComponentStyle = (id: string, style: Record<string, any>) => {
    const root = currentTree.value
    if (!root) return

    const node = findNodeById(root, id)
    if (node) {
      node.style = { ...node.style, ...style }
    }
  }

  /**
   * 选中组件
   */
  const setSelected = (id: string | null) => {
    selectedId.value = id
  }

  /**
   * 清除选中
   */
  const clearSelection = () => {
    selectedId.value = null
  }

  /**
   * 移动组件
   * @param id 组件ID
   * @param newParentId 新父节点ID
   * @param index 插入位置
   */
  const moveComponent = (id: string, newParentId: string, index?: number): boolean => {
    const root = currentTree.value
    if (!root) return false

    // 找到要移动的节点
    const node = findNodeById(root, id)
    if (!node) return false

    // 不能移动根节点
    if (id === root.id) return false

    // 防止将节点移动到自己的子节点中
    let isDescendant = false
    traverse(node, (n: NodeSchema) => {
      if (n.id === newParentId) isDescendant = true
    })
    if (isDescendant) {
      console.warn('[ComponentStore] Cannot move node into its own descendant')
      return false
    }

    // 先从原位置移除
    const removed = removeComponent(id)
    if (!removed) return false

    // 找到新父节点并添加
    const newParent = findNodeById(root, newParentId) || root
    if (!newParent.children) newParent.children = []

    if (index !== undefined && index >= 0) {
      newParent.children.splice(index, 0, node)
    } else {
      newParent.children.push(node)
    }

    return true
  }

  /**
   * 切换页面
   */
  const setCurrentPage = (index: number) => {
    if (index >= 0 && index < project.value.pages.length) {
      currentPageIndex.value = index
      clearSelection()
    }
  }

  /**
   * 添加新页面
   */
  const addPage = (name: string, path: string): PageSchema => {
    const newPage: PageSchema = {
      id: `page_${Date.now()}`,
      name,
      path,
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
    return newPage
  }

  /**
   * 设置拖拽状态
   */
  const setDragging = (dragging: boolean) => {
    isDragging.value = dragging
  }

  /**
   * 导出项目数据
   */
  const exportProject = (): ProjectSchema => {
    return JSON.parse(JSON.stringify(project.value))
  }

  /**
   * 导入项目数据
   */
  const importProject = (data: ProjectSchema) => {
    project.value = data
    currentPageIndex.value = 0
    clearSelection()
  }

  return {
    // State
    project,
    currentPageIndex,
    selectedId,
    isDragging,

    // Getters
    currentPage,
    currentTree,
    selectedComponent,
    flatComponents,

    // Actions
    addComponent,
    removeComponent,
    updateComponentProps,
    updateComponentStyle,
    setSelected,
    clearSelection,
    moveComponent,
    setCurrentPage,
    addPage,
    setDragging,
    exportProject,
    importProject,
  }
})
