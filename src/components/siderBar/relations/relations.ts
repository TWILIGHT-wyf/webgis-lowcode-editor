import { ref, computed, watch } from 'vue'
import { useComponent } from '@/stores/component'
import { storeToRefs } from 'pinia'

// 事件动作接口
export interface Action {
  type: string
  targetId?: string
}

// 数据绑定接口
export interface DataBinding {
  sourceId: string
  sourcePath: string
  targetPath: string
  /**
   * 数据转换器（可选）
   * - 不填：直接复制源值 (target = source)
   * - 表达式：value * 100 或 value.toFixed(2)
   * - 模板字符串：当前温度: ${value}℃
   * - 函数体：return value > 50 ? '高' : '低'
   */
  transformer?: string
  /**
   * 转换器类型
   * - 'expression': JS 表达式（默认）
   * - 'template': 模板字符串
   */
  transformerType?: 'expression' | 'template'
}

// 树节点接口
export interface TreeNode {
  id: string
  label: string
  type: string
  groupId?: string
  children?: TreeNode[]
}

/**
 * 组件层级关系管理
 */
export function useComponentHierarchy() {
  const componentStore = useComponent()
  const { selectComponent, componentStore: components } = storeToRefs(componentStore)

  // 父组件
  const parentComponent = computed(() => {
    if (!selectComponent.value) return null
    const parentId = selectComponent.value.groupId
    if (!parentId) return null
    return components.value.find((c) => c.id === parentId)
  })

  // 子组件列表
  const childrenComponents = computed(() => {
    if (!selectComponent.value?.children) return []
    return components.value.filter((c) => selectComponent.value?.children?.includes(c.id))
  })

  // 组合组件
  const groupComponent = computed(() => {
    if (!selectComponent.value?.groupId) return null
    return components.value.find((c) => c.id === selectComponent.value?.groupId)
  })

  // 可用的父组件（排除自己和子组件）
  const availableParents = computed(() => {
    if (!selectComponent.value) return []
    const currentId = selectComponent.value.id
    const childrenIds = selectComponent.value.children || []
    return components.value.filter(
      (c) => c.id !== currentId && !childrenIds.includes(c.id) && c.type !== 'Text',
    )
  })

  // 可用的子组件（排除自己和父组件）
  const availableChildren = computed(() => {
    if (!selectComponent.value) return []
    const currentId = selectComponent.value.id
    const parentId = selectComponent.value.groupId
    return components.value.filter((c) => c.id !== currentId && c.id !== parentId && !c.groupId)
  })

  // 其他组件（用于事件交互）
  const otherComponents = computed(() => {
    if (!selectComponent.value) return []
    return components.value.filter((c) => c.id !== selectComponent.value?.id)
  })

  // 设置父组件
  function setParent(parentId: string) {
    if (!selectComponent.value || !parentId) return

    const parent = components.value.find((c) => c.id === parentId)
    if (!parent) return

    // 初始化父组件的 children 数组
    if (!parent.children) {
      parent.children = []
    }

    // 添加到父组件的 children 列表
    if (!parent.children.includes(selectComponent.value.id)) {
      parent.children.push(selectComponent.value.id)
    }

    // 设置当前组件的 groupId
    selectComponent.value.groupId = parentId
  }

  // 移除父组件
  function removeParent() {
    if (!selectComponent.value || !selectComponent.value.groupId) return

    const parent = components.value.find((c) => c.id === selectComponent.value?.groupId)
    if (parent && parent.children) {
      parent.children = parent.children.filter((id) => id !== selectComponent.value?.id)
    }

    selectComponent.value.groupId = undefined
  }

  // 添加子组件
  function addChild(childId: string) {
    if (!selectComponent.value || !childId) return

    const child = components.value.find((c) => c.id === childId)
    if (!child) return

    // 初始化 children 数组
    if (!selectComponent.value.children) {
      selectComponent.value.children = []
    }

    // 添加到 children 列表
    if (!selectComponent.value.children.includes(childId)) {
      selectComponent.value.children.push(childId)
    }

    // 设置子组件的 groupId
    child.groupId = selectComponent.value.id
  }

  // 移除子组件
  function removeChild(childId: string) {
    if (!selectComponent.value?.children) return

    const child = components.value.find((c) => c.id === childId)
    if (child) {
      child.groupId = undefined
    }

    selectComponent.value.children = selectComponent.value.children.filter((id) => id !== childId)
  }

  // 从组合中移除
  function removeFromGroup() {
    if (!selectComponent.value?.groupId) return

    const group = components.value.find((c) => c.id === selectComponent.value?.groupId)
    if (group && group.children) {
      group.children = group.children.filter((id) => id !== selectComponent.value?.id)
    }

    selectComponent.value.groupId = undefined
  }

  // 选择组件
  function selectComponentById(id: string) {
    const comp = components.value.find((c) => c.id === id)
    if (comp) {
      selectComponent.value = comp
    }
  }

  return {
    selectComponent,
    components,
    parentComponent,
    childrenComponents,
    groupComponent,
    availableParents,
    availableChildren,
    otherComponents,
    setParent,
    removeParent,
    addChild,
    removeChild,
    removeFromGroup,
    selectComponentById,
  }
}

/**
 * 事件交互管理
 */
export function useComponentEvents() {
  const clickActions = ref<Action[]>([])
  const hoverActions = ref<Action[]>([])

  function addClickAction() {
    clickActions.value.push({ type: '' })
  }

  function removeClickAction(index: number) {
    clickActions.value.splice(index, 1)
  }

  function addHoverAction() {
    hoverActions.value.push({ type: '' })
  }

  function removeHoverAction(index: number) {
    hoverActions.value.splice(index, 1)
  }

  return {
    clickActions,
    hoverActions,
    addClickAction,
    removeClickAction,
    addHoverAction,
    removeHoverAction,
  }
}

/**
 * 数据联动管理
 */
export function useDataBindings() {
  const componentStore = useComponent()
  const { selectComponent } = storeToRefs(componentStore)

  const dataBindings = computed<DataBinding[]>({
    get: () => selectComponent.value?.dataBindings ?? [],
    set: (value) => {
      if (!selectComponent.value) return
      selectComponent.value.dataBindings = value
    },
  })

  function ensureBindings() {
    if (!selectComponent.value) return
    if (!selectComponent.value.dataBindings) selectComponent.value.dataBindings = []
  }

  function addDataBinding() {
    ensureBindings()
    if (!selectComponent.value) return
    selectComponent.value.dataBindings!.push({ sourceId: '', sourcePath: '', targetPath: '' })
    componentStore.commit()
  }

  function removeDataBinding(index: number) {
    if (!selectComponent.value?.dataBindings) return
    selectComponent.value.dataBindings.splice(index, 1)
    componentStore.commit()
  }

  // 编辑过程中自动提交（输入框 v-model 会直接改对象）
  watch(
    () => selectComponent.value?.dataBindings,
    () => {
      if (!selectComponent.value) return
      componentStore.commitDebounced()
    },
    { deep: true },
  )

  return { dataBindings, addDataBinding, removeDataBinding }
}

/**
 * 对话框状态管理
 */
export function useDialogState() {
  const showAddChildDialog = ref(false)
  const selectedParentId = ref('')
  const selectedChildId = ref('')

  function openAddChildDialog() {
    showAddChildDialog.value = true
  }

  function closeAddChildDialog() {
    showAddChildDialog.value = false
    selectedChildId.value = ''
  }

  function resetSelectedIds() {
    selectedParentId.value = ''
    selectedChildId.value = ''
  }

  return {
    showAddChildDialog,
    selectedParentId,
    selectedChildId,
    openAddChildDialog,
    closeAddChildDialog,
    resetSelectedIds,
  }
}

/**
 * 树形结构管理
 */
export function useTreeOperations() {
  const componentStore = useComponent()
  const { componentStore: components } = storeToRefs(componentStore)

  // 构建树形数据
  const treeData = computed<TreeNode[]>(() => {
    // 计算同类型组件的序号
    const typeCountMap = new Map<string, number>()
    const typeIndexMap = new Map<string, number>()

    // 统计每种类型的数量
    components.value.forEach((c) => {
      const count = typeCountMap.get(c.type) || 0
      typeCountMap.set(c.type, count + 1)
    })

    const buildTree = (compId: string): TreeNode => {
      const comp = components.value.find((c) => c.id === compId)
      if (!comp) return { id: compId, label: 'Unknown', type: 'Unknown' }

      // 优先使用自定义名称
      let label = ''
      if (comp.name) {
        label = comp.name
      } else {
        // 获取当前类型的序号
        const currentIndex = (typeIndexMap.get(comp.type) || 0) + 1
        typeIndexMap.set(comp.type, currentIndex)

        // 如果同类型组件多于1个，显示序号
        const count = typeCountMap.get(comp.type) || 0
        if (count > 1) {
          label = `${comp.type} #${currentIndex}`
        } else {
          label = comp.type
        }
      }

      const node: TreeNode = {
        id: comp.id,
        label: label,
        type: comp.type,
        groupId: comp.groupId,
      }

      if (comp.children && comp.children.length > 0) {
        node.children = comp.children.map(buildTree)
      }

      return node
    }

    // 只显示顶层组件(无父组件的组件)
    const topLevel = components.value.filter((c) => !c.groupId)
    return topLevel.map((c) => buildTree(c.id))
  })

  // 树节点点击
  function handleNodeClick(data: TreeNode) {
    const { selectComponentById } = useComponentHierarchy()
    selectComponentById(data.id)
  }

  // 获取所有节点的key
  function getAllNodeKeys(nodes: TreeNode[]): string[] {
    const keys: string[] = []
    nodes.forEach((node) => {
      keys.push(node.id)
      if (node.children) {
        keys.push(...getAllNodeKeys(node.children))
      }
    })
    return keys
  }

  // 从树中移除父组件
  function removeParentFromTree(childId: string) {
    const child = components.value.find((c) => c.id === childId)
    if (child && child.groupId) {
      const parent = components.value.find((c) => c.id === child.groupId)
      if (parent && parent.children) {
        parent.children = parent.children.filter((id) => id !== childId)
      }
      child.groupId = undefined
    }
  }

  // 树节点拖拽相关
  interface TreeNodeInstance {
    data: TreeNode
  }

  function allowDrop(draggingNode: TreeNodeInstance, dropNode: TreeNodeInstance, type: string) {
    // 只允许拖入容器组件内部
    if (type === 'inner') {
      const dropNodeData = dropNode.data
      const draggingNodeData = draggingNode.data

      // 不能拖入自己
      if (dropNodeData.id === draggingNodeData.id) return false

      // 检查目标是否为容器组件
      const targetComp = components.value.find((c) => c.id === dropNodeData.id)
      if (!targetComp) return false

      // Text 组件不能作为容器
      if (targetComp.type === 'Text') return false

      // 不能拖入自己的子组件
      if (targetComp.groupId === draggingNodeData.id) return false

      return true
    }
    return false
  }

  function allowDrag() {
    // 所有组件都允许拖拽
    return true
  }

  function handleNodeDrop(
    draggingNode: TreeNodeInstance,
    dropNode: TreeNodeInstance,
    dropType: string,
  ) {
    if (dropType === 'inner') {
      const draggingNodeData = draggingNode.data
      const dropNodeData = dropNode.data

      const child = components.value.find((c) => c.id === draggingNodeData.id)
      const parent = components.value.find((c) => c.id === dropNodeData.id)

      if (!child || !parent) return

      // 移除原来的父子关系
      if (child.groupId) {
        const oldParent = components.value.find((c) => c.id === child.groupId)
        if (oldParent && oldParent.children) {
          oldParent.children = oldParent.children.filter((id) => id !== child.id)
        }
      }

      // 建立新的父子关系
      if (!parent.children) {
        parent.children = []
      }
      if (!parent.children.includes(child.id)) {
        parent.children.push(child.id)
      }
      child.groupId = parent.id

      // 初始化父组件的布局配置
      if (!parent.layout) {
        parent.layout = {
          mode: 'absolute',
          gap: 8,
          columns: 2,
          align: 'start',
          padding: 0,
        }
      }
    }
  }

  return {
    treeData,
    handleNodeClick,
    getAllNodeKeys,
    removeParentFromTree,
    allowDrop,
    allowDrag,
    handleNodeDrop,
  }
}

/**
 * 布局配置管理
 */
export function useLayoutConfig() {
  const componentStore = useComponent()
  const { selectComponent } = storeToRefs(componentStore)

  // 是否为容器组件
  const isContainer = computed(() => {
    return (
      selectComponent.value &&
      selectComponent.value.children &&
      selectComponent.value.children.length > 0
    )
  })

  // 布局配置
  const layoutMode = computed({
    get: () => selectComponent.value?.layout?.mode || 'absolute',
    set: (val) => {
      if (!selectComponent.value) return
      if (!selectComponent.value.layout) {
        selectComponent.value.layout = {
          mode: val as 'absolute' | 'horizontal' | 'vertical' | 'grid',
        }
      } else {
        selectComponent.value.layout.mode = val as 'absolute' | 'horizontal' | 'vertical' | 'grid'
      }
    },
  })

  const layoutGap = computed({
    get: () => selectComponent.value?.layout?.gap ?? 8,
    set: (val) => {
      if (!selectComponent.value?.layout) return
      selectComponent.value.layout.gap = val
    },
  })

  const layoutColumns = computed({
    get: () => selectComponent.value?.layout?.columns ?? 2,
    set: (val) => {
      if (!selectComponent.value?.layout) return
      selectComponent.value.layout.columns = val
    },
  })

  const layoutAlign = computed({
    get: () => selectComponent.value?.layout?.align || 'start',
    set: (val) => {
      if (!selectComponent.value?.layout) return
      selectComponent.value.layout.align = val as 'start' | 'center' | 'end' | 'stretch'
    },
  })

  const layoutPadding = computed({
    get: () => selectComponent.value?.layout?.padding ?? 0,
    set: (val) => {
      if (!selectComponent.value?.layout) return
      selectComponent.value.layout.padding = val
    },
  })

  // 监听布局模式变化,初始化 layout 对象
  watch(
    () => selectComponent.value,
    (newVal) => {
      if (newVal && !newVal.layout && newVal.children && newVal.children.length > 0) {
        newVal.layout = {
          mode: 'absolute',
          gap: 8,
          columns: 2,
          align: 'start',
          padding: 0,
        }
      }
    },
    { immediate: true },
  )

  return {
    isContainer,
    layoutMode,
    layoutGap,
    layoutColumns,
    layoutAlign,
    layoutPadding,
  }
}
