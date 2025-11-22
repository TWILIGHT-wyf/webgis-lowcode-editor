import { ref, computed } from 'vue'
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
  const dataBindings = ref<DataBinding[]>([])

  function addDataBinding() {
    dataBindings.value.push({ sourceId: '', sourcePath: '', targetPath: '' })
  }

  function removeDataBinding(index: number) {
    dataBindings.value.splice(index, 1)
  }

  return {
    dataBindings,
    addDataBinding,
    removeDataBinding,
  }
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
