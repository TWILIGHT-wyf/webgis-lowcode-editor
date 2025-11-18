import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createHistory, createClipboard, createGrouping, createZOrder } from '@/stores/componentOps'

export interface DataSource {
  enabled: boolean
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: string
  interval?: number
  dataPath?: string
  [key: string]: unknown
}

export interface component {
  id: string
  type: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  rotation: number
  zindex: number
  style: {
    opacity?: number
    visible?: boolean
    locked?: boolean
    [key: string]: unknown
  }
  props: Record<string, unknown>
  dataSource?: DataSource
  animation?: {
    name: string
    class: string
    duration?: number
    delay?: number
    iterationCount?: number | 'infinite'
    timingFunction?: string
    trigger?: 'load' | 'hover' | 'click'
  }
  groupId?: string // 所属组合的ID（如果是组合成员）
  children?: string[] // 子组件ID列表（如果是组合容器）
}

export const useComponent = defineStore('component', () => {
  const componentStore = ref<component[]>([])
  const selectComponent = ref<component | null>(null)
  const selectedIds = ref<string[]>([])
  const isDragging = ref<boolean>(false)

  // —— 历史快照（撤销/重做）—— 抽离到模块
  const {
    commit,
    undo: _undo,
    redo: _redo,
    canUndo,
    canRedo,
    commitDebounced,
    commitThrottled,
    init: initHistory,
  } = createHistory<component>(componentStore)

  function undo() {
    _undo()
    clearSelection()
  }
  function redo() {
    _redo()
    clearSelection()
  }

  // 不同类型组件的默认样式
  function defaultStyleByType(type: string): component['style'] {
    const base: component['style'] = {
      opacity: 100,
      visible: true,
      locked: false,
    }
    switch (type) {
      case 'Text':
        return {
          ...base,
          fontSize: 16,
          fontColor: '#000000',
          fontWeight: 'normal',
          textAlign: 'left',
          letterSpacing: 0,
          lineHeight: 1.2,
          paddingX: 0,
          paddingY: 0,
        }

      default:
        return base
    }
  }

  // 不同类型组件的默认非样式属性
  function defaultPropsByType(type: string): Record<string, unknown> {
    switch (type) {
      case 'Text':
        return {
          text: '示例文本',
        }
      default:
        return {}
    }
  }

  // 不同类型组件的默认数据源配置
  function defaultDataSourceByType(type: string): DataSource | undefined {
    switch (type) {
      case 'Text':
        return {
          enabled: false,
          url: '',
          method: 'GET',
          headers: {},
          body: '',
          interval: 0,
          dataPath: '',
        }
      default:
        return undefined
    }
  }

  // 不同类型组件的默认动画配置（默认无动画）
  function defaultAnimationByType(): component['animation'] | undefined {
    return undefined
  }

  // 添加组件
  function addComponent(
    component: Omit<component, 'id' | 'zindex' | 'style' | 'props'> & {
      style?: component['style']
      props?: Record<string, unknown>
    },
  ) {
    const maxZ = componentStore.value.reduce((max, c) => Math.max(max, c.zindex ?? 0), 0)
    const newComponent: component = {
      ...component,
      id: Date.now().toString(),
      zindex: maxZ + 1,
      style: {
        ...defaultStyleByType(component.type),
        ...(component.style || {}),
      },
      props: {
        ...defaultPropsByType(component.type),
        ...(component.props || {}),
      },
      dataSource: component.dataSource || defaultDataSourceByType(component.type),
      animation: component.animation || defaultAnimationByType(),
    }
    componentStore.value.push(newComponent)
    commit()
  }

  // 组件Id
  function selectedId(id: string) {
    selectComponent.value = componentStore.value.find((com) => com.id === id) || null
    // 单选时同步更新selectedIds
    if (selectComponent.value) {
      selectedIds.value = [id]
    } else {
      selectedIds.value = []
    }
  }

  // 切换选中状态（支持Ctrl多选）
  function toggleSelect(id: string, ctrlKey: boolean) {
    if (ctrlKey) {
      // Ctrl+点击：切换选中
      const index = selectedIds.value.indexOf(id)
      if (index > -1) {
        selectedIds.value.splice(index, 1)
      } else {
        selectedIds.value.push(id)
      }
      // 更新主选择对象为第一个选中项
      if (selectedIds.value.length > 0) {
        selectComponent.value =
          componentStore.value.find((c) => c.id === selectedIds.value[0]) || null
      } else {
        selectComponent.value = null
      }
    } else {
      // 普通点击：单选
      selectedId(id)
    }
  }

  // 批量选中
  function selectMultiple(ids: string[]) {
    selectedIds.value = [...ids]
    if (ids.length > 0) {
      selectComponent.value = componentStore.value.find((c) => c.id === ids[0]) || null
    } else {
      selectComponent.value = null
    }
  }

  // 清空选择
  function clearSelection() {
    selectedIds.value = []
    selectComponent.value = null
  }

  // 判断是否选中
  function isSelected(id: string): boolean {
    return selectedIds.value.includes(id)
  }

  // 更新组件大小
  function updateComponentSize(size: { width: number; height: number }) {
    if (selectComponent.value) {
      selectComponent.value.size.width = size.width
      selectComponent.value.size.height = size.height
      commitDebounced()
    }
  }
  // 更新组件位置
  function updateComponentPosition(position: { x: number; y: number }) {
    if (selectComponent.value) {
      selectComponent.value.position.x = position.x
      selectComponent.value.position.y = position.y
      commitDebounced()
    }
  }

  // 更新组件旋转
  function updateComponentRotation(rotate: number) {
    if (selectComponent.value) {
      selectComponent.value.rotation = rotate
      commitDebounced()
    }
  }

  // 删除组件
  function removeComponent(id: string) {
    const index = componentStore.value.findIndex((c) => c.id === id)
    if (index > -1) {
      componentStore.value.splice(index, 1)
    }
    // 从selectedIds中移除
    const selectedIndex = selectedIds.value.indexOf(id)
    if (selectedIndex > -1) {
      selectedIds.value.splice(selectedIndex, 1)
    }
    if (selectComponent.value?.id === id) {
      selectComponent.value = null
    }
    commit()
  }

  // 批量删除组件
  function removeMultipleComponents(ids: string[]) {
    ids.forEach((id) => {
      const index = componentStore.value.findIndex((c) => c.id === id)
      if (index > -1) {
        componentStore.value.splice(index, 1)
      }
    })
    clearSelection()
    commit()
  }

  // 复制/剪切/粘贴模块化
  const { clipboard, copy, cut, copyMultiple, cutMultiple, paste } = createClipboard<component>(
    componentStore,
    { selectedId, selectMultiple, commit },
  )

  // —— 图层（z-index）操作模块 ——
  const { bringForward, sendBackward, bringToFront, sendToBack } = createZOrder<component>(
    componentStore,
    { commit },
  )

  // 组合/取消组合模块化
  const { groupComponents, ungroupComponents } = createGrouping<component>(componentStore, {
    selectedId,
    selectMultiple,
    commit,
  })

  // 清空画布
  function reset() {
    componentStore.value.length = 0
    selectComponent.value = null
    selectedIds.value = []
    clipboard.value.length = 0
    isDragging.value = false
    commit()
  }

  // 初始化历史：记录初始空白状态
  initHistory()
  return {
    cut,
    copy,
    paste,
    copyMultiple,
    cutMultiple,
    componentStore,
    addComponent,
    updateComponentSize,
    updateComponentPosition,
    selectedId,
    toggleSelect,
    selectMultiple,
    clearSelection,
    isSelected,
    updateComponentRotation,
    removeComponent,
    removeMultipleComponents,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    groupComponents,
    ungroupComponents,
    selectComponent,
    selectedIds,
    isDragging,
    clipboard,
    commit,
    undo,
    redo,
    canUndo,
    canRedo,
    commitDebounced,
    commitThrottled,
    reset,
  }
})
